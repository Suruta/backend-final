const prisma = require('../lib/prisma');

const getRoutes = async (req, res) => {
	try {
		const { status } = req.query;
		const where = {};

		if (status) {
			where.status = { status };
		}

		const routes = await prisma.route.findMany({
			where
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
			where: { id: routeId }
		});
		if (!route) {
			return res.status(400).json({ msg: 'Route not found' });
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