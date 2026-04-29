const { Router } = require('express');
const { modifyUser, deleteUser } = require('../controllers/user.controller');
const { requireAuth, requireRole } = require('../middleware/auth');

const routes = Router();

routes.put('/:id', requireAuth, modifyUser);
// routes.route('/:id').put(requireAuth, modifyUser);
routes.delete('/:id', requireAuth, requireRole('restaurant_owner', 'shelter_manager'), deleteUser);
// routes.route('/:id').delete(requireAuth, requireRole('restaurant_owner', 'shelter_manager'), deleteUser);

module.exports = routes;