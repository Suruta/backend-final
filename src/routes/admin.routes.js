const { Router } = require('express');
const { getUsers, getUserById, getAuditLogs } = require('../controllers/admin.controllers');
const { requireAuth, requireRole } = require('../middleware/auth');

const routes = Router();

routes.get('/audit-logs', requireAuth, requireRole('restaurant_owner'), getAuditLogs);

module.exports = routes;
