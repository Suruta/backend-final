const prisma = require('../lib/prisma');

const createRoute = async (req, res) => {};

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
		res.status(500).json({ msg: 'failed to fetch auth drivers routes' });
	}
};

const getRouteById = async (req, res) => {
	try {
		const routeId = parseInt(req.params.id);
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
		res.status(500).json({ msg: 'failed to fetch auth drivers routes' });
	}
};

const checkRoute = async (req, res) => {
	try {

	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: 'failed to fetch auth drivers routes' });
	}
};

const reportRoute = async (req, res) => {
	try {

	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: 'failed to fetch auth drivers routes' });
	}
};

module.exports = {
	getRoutes,
	getRouteById,
	checkRoute,
	reportRoute
};