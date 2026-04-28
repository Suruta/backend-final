const { Router } = require('express');
const { modifyUser, deleteUser } = require('../controllers/user.controller');
const { requireAuth, requireRole } = require('../middleware/auth');

const routes = Router();

// routes.route('/').get(getUsers);
// routes.route('/:id').get(requireAuth, getUserById);
routes.route('/:id').put(requireAuth, modifyUser);
routes.route('/:id').delete(requireAuth, requireRole('restaurant_owner', 'shelter_manager'), deleteUser);
// routes.route('/auth/register').post(registerUser);
// routes.route('/auth/login').post(loginUser);

module.exports = routes;