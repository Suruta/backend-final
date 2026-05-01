const { Router } = require('express');
const { modifyUser, deleteUser, getUsers, getUserById } = require('../controllers/user.controller');
const { requireAuth, requireRole } = require('../middleware/auth');

const routes = Router();

routes.get('/', requireAuth, requireRole('restaurant_owner', 'shelter_manager'), getUsers);
routes.get('/:id', requireAuth, getUserById);
routes.put('/:id', requireAuth, modifyUser);
routes.delete('/:id', requireAuth, requireRole('restaurant_owner', 'shelter_manager'), deleteUser);

module.exports = routes;