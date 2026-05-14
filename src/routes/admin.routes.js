const { Router } = require('express');
const { getUsers, getUserById, getAuditLogs, triggerDecay } = require('../controllers/admin.controllers');
const { requireAuth, requireRole } = require('../middleware/auth');

const routes = Router();

routes.get('/audit-logs', requireAuth, requireRole('restaurant_owner'), getAuditLogs);
routes.post('/decay/trigger', requireAuth, requireRole('restaurant_owner'), triggerDecay);

module.exports = routes;
