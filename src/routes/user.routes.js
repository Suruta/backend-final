const { Router } = require('express');
const { getUsers, getUserById, registerUser, loginUser, modifyUser } = require('../controllers/user.controller');
const { requireAuth, requireRole } = require('../middleware/auth');

const routes = Router();

routes.route('/').get(getUsers);
routes.route('/:id').get(requireAuth, getUserById);
routes.route('/:id').put(modifyUser);
routes.route('/auth/register').post(registerUser);
routes.route('/auth/login').post(loginUser);

module.exports = routes;