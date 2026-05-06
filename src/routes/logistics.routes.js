const { Router } = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const { getRoutes, createRoute, getRouteById, checkRoute, reportRoute } = require('../controllers/logistics.controllers');

const routes = Router();

routes.get('/routes', requireAuth, requireRole('restaurant_owner', 'driver'), getRoutes);
routes.post('/routes', requireAuth, requireRole('restaurant_owner'), createRoute);
routes.get('/routes/:routeId', requireAuth, requireRole('restaurant_owner', 'driver'), getRouteById);
routes.patch('/stops/:stopId/arrive', requireAuth, requireRole('driver'), checkRoute);
routes.post('/stops/:stopId/report',requireAuth, requireRole('driver'),  reportRoute);

module.exports = routes;