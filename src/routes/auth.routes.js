const { Router } = require('express');
const { registerUser, loginUser } = require('../controllers/auth.controllers');

const routes = Router();

routes.route('/register').post(registerUser);
routes.route('/login').post(loginUser);

module.exports = routes;