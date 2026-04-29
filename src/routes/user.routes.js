const { Router } = require('express');
const { modifyUser, deleteUser, getUsers, getUserById } = require('../controllers/user.controller');
const { requireAuth, requireRole } = require('../middleware/auth');

const routes = Router();

routes.put('/:id', requireAuth, modifyUser);
// routes.route('/:id').put(requireAuth, modifyUser);
routes.delete('/:id', requireAuth, requireRole('restaurant_owner', 'shelter_manager'), deleteUser);
// routes.route('/:id').delete(requireAuth, requireRole('restaurant_owner', 'shelter_manager'), deleteUser);
routes.get('/', requireAuth, requireRole('restaurant_owner', 'shelter_manager'), getUsers);
routes.get('/:id', requireAuth, getUserById);

module.exports = routes;