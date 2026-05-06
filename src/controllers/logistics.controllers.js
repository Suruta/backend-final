const prisma = require('../lib/prisma');
const haversine = require('../utils/haversine');

function optimizeStop(stops) {
	const unvisited = stops.map((s) => ({...s}));

	const startIndex = unvisited.findIndex((s) => s.stopType === 'pickup');
	const [start] = unvisited.splice(startIndex, 1);

	const ordered = [start];

	while (unvisited.length > 0) {
		const curr = ordered[ordered.length - 1];

		let nearIndex = 0;
		let nearDistance = Infinity;

		for (let i = 0; i < unvisited.lengthl; i++) {
			const dist = haversine(curr.lat, curr.lng, unvisited[i].lat, unvisited[i].lng);
			if (dist < nearDistance) {
				nearDistance = dist;
				nearIndex = i;
			}
		}

		const [near] = unvisited.splice(nearIndex, 1);
		ordered.push(near);
	}

	ordered.forEach((stop, index) => {
		stop.sequenceOrder = index + 1;
	});

	return ordered;
}

function buildGeoJSON(orderedStops) {
	return {
		type: 'LineString',
		coordinates: orderedStops.map((s) => [s.lat, s.lng])
	}
}

const createRoute = async (req, res) => {
	try {
		const driverId = parseInt(req.body.driverId);
		const stops = req.body.stops;

		const driver = await prisma.user.findUnique({
			where: { id: driverId }
		});
		if (!driver) {
			return res.status(400).json({ msg: 'Driver not found' });
		}

		const activeRoute = await prisma.route.findFirst({
			where: {
				driverId,
				status: 'in_transit'
			}
		});
		if (activeRoute) {
			return res.status(400).json({ msg: 'Driver is busy' });
		}

		if (!Array.isArray(stops) || stops.length < 2) {
			res.status(400).json({ msg: 'Route must have at least 2 stops' });
		}

		const hasPickup = stops.some((s) => s.stopType === 'pickup');
		const hasDelivery = stops.some((s) => s.stopType === 'delivery');

		if (!hasPickup) {
			res.status(400).json({ msg: 'At least one pickup(restaurant) is required' });
		}
		if (!hasDelivery) {
			res.status(400).json({ msg: 'At least one delivery(consumer or shelter) is required' });
		}

		const orderedStops = optimizeStop(stops);
		const optimizedPath = buildGeoJSON(orderedStops);

		const route = await prisma.route.create({
			data: {
				driverId,
				status: 'idle',
				optimizedPath,
				stops: {
					create: orderedStops.map((s) => ({
						stopType: s.stopType,
						lat: s.lat,
						lng: s.lng,
						sequenceOrder: s.sequenceOrder,
						arrivalRadius: s.arrivalRadius ?? 100,
						isCompleted: false
					}))
				}
			},
			include: {
				stops: {
					orderBy: {
						sequenceOrder: 'asc'
					}
				}
			}
		});

		res.status(201).json({
			message: 'Route created successfully',
			route
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: 'Failed to create a route' });
	}
};

const getRoutes = async (req, res) => {
	try {
		const { id, role, status, limit } = req.query;
		const driverId = parseInt(id);
		const newLimit = limit ? parseInt(limit) : 10;

		const where = {};

		if (id && role && role === 'driver') {
			where.driverId = { driverId };
		}
		if (status) {
			where.status = { status };
		}

		const routes = await prisma.route.findMany({
			where,
			include: {
				stops: true
			},
			take: newLimit
		});

		res.json({ count: routes.length, data: routes });
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: 'Failed to fetch auth drivers routes' });
	}
};

const getRouteById = async (req, res) => {
	try {
		const routeId = parseInt(req.params.routeId);
		if (isNaN(routeId)) {
			return res.status(400).json({ msg: 'Invalid type of id' });
		}

		const route = await prisma.route.findUnique({
			where: { id: routeId },
			include: {
				stops: { orderBy: { sequenceOrder: 'asc' } }
			}
		});
		if (!route) {
			return res.status(404).json({ msg: 'Route not found' });
		}

		res.json(route);
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: 'Failed to fetch an auth drivers route' });
	}
};

const checkRoute = async (req, res) => {
	try {
		const stopId = parseInt(req.params.stopId);
		const lat = parseInt(req.body.lat);
		const lng = parseInt(req.body.lng);

		const stop = await prisma.routeStop.findUnique({
			where: { id: stopId },
			include: {
				route: true
			}
		});
		if (!stop) {
			return res.status(400).json({ msg: 'Route stop not found' });
		}

		if (stop.route.driverId !== req.user.sub) {
			return res.status(400).json({ msg: 'Route stop does not belong to you' });
		}

		if (stop.isCompleted) {
			return res.status(400).json({ msg: 'Route stop already have been marked as completed' });
		}

		const dist = haversine(lat, lng, stop.lat, stop.lng);
		if (dist > stop.arrivalRadius) {
			return res.status(400).json({ msg: 'You are still far away so, keep fucking moving!' });
		}

		const completed = await prisma.routeStop.update({
			where: { id: stopId },
			data: {
				isCompleted: true
			}
		});

		const allStops = await prisma.routeStop.findMany({
			where: {
				routeId: stop.route.id
			},
			select: {
				isCompleted: true
			}
		});

		const allDone = allStops.every((s) => s.isCompleted);

		const newRouteStatus = allDone ? 'completed': 'in_transit';

		await prisma.route.update({
			where: { id: stop.route.id },
			data: {
				status: newRouteStatus
			}
		});

		res.json({
			completed,
			newRouteStatus
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: 'Failed to check an auth drivers route' });
	}
};

const reportRoute = async (req, res) => {
	try {
		const stopId = parseInt(req.params.stopId);
		const { issueType, notes } = req.body;

		const stop = await prisma.routeStop.findUnique({
			where: {
				id: stopId
			},
			include: {
				route: true
			}
		});
		if (!stop) {
			return res.status(400).json({ msg: 'Route stop not found' });
		}

		if (stop.route.driverId !== req.user.sub) {
			return res.status(400).json({ msg: 'This route stop does not belong to you' });
		}

		res.status(201).json({
			message: 'Issue reported successfully',
			stopId,
			issueType,
			notes
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: 'Failed to report an auth drivers route' });
	}
};

module.exports = {
	createRoute,
	getRoutes,
	getRouteById,
	checkRoute,
	reportRoute
};