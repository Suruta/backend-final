const { Router } = require('express');
const { getUsers, getUserById, registerUser, loginUser } = require('../controllers/user.controller');

const routes = Router();

routes.route('/').get(getUsers);
routes.route('/:id').get(getUserById);
routes.route('/auth/register').post(registerUser);
routes.route('/auth/login').post(loginUser);

module.exports = routes;