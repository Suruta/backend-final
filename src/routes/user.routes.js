const { Router } = require('express');
const { registerUser } = require('../controllers/user.controller');

const routes = Router();

routes.route('/register').post(registerUser);

module.exports = routes;