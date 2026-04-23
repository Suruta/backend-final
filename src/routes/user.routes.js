const { Router } = require('express');
const { getUsers, getUserById, registerUser } = require('../controllers/user.controller');

const routes = Router();

routes.route('/').get(getUsers);
routes.route('/:id').get(getUserById);
routes.route('/register').post(registerUser);

module.exports = routes;