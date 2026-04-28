const { Router } = require('express');
const { getUsers, getUserById } = require('../controllers/admin.controllers');
const { requireAuth, requireRole } = require('../middleware/auth');

const routes = Router();

routes.route('/').get(requireAuth, requireRole('restaurant_owner', 'shelter_manager'), getUsers);
routes.route('/:id').get(requireAuth, getUserById);

module.exports = routes;
