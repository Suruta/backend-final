const { Router } = require('express');
const { registerUser, loginUser, refreshToken, logoutUser } = require('../controllers/auth.controllers');
const { requireAuth } = require('../middleware/auth');

const routes = Router();

// routes.route('/register').post(registerUser);
// routes.route('/login').post(loginUser);
routes.post('/register', registerUser);
routes.post('/login', loginUser);
routes.post('/refresh', requireAuth, refreshToken);
routes.post('/logout', logoutUser);

module.exports = routes;