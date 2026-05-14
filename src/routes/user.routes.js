const { Router } = require('express');
const { modifyUser, deleteUser, getUsers, getUserById, getUserProfile, updateUserProfile, getUserAllergyProfile, updateUserAllergyProfile, getConsumerBids } = require('../controllers/user.controller');
const { requireAuth, requireRole } = require('../middleware/auth');

const routes = Router();

routes.get('/me', requireAuth, getUserProfile);
routes.patch('/me', requireAuth, updateUserProfile);
routes.get('/me/allergy-profile', requireAuth, getUserAllergyProfile);
routes.put('/me/allergy-profile', requireAuth, updateUserAllergyProfile);
routes.get('/me/bids', requireAuth, getConsumerBids); // done

routes.get('/', requireAuth, requireRole('restaurant_owner', 'shelter_manager'), getUsers);
routes.get('/:id', requireAuth, getUserById);
routes.put('/:id', requireAuth, modifyUser);
routes.delete('/:id', requireAuth, requireRole('restaurant_owner', 'shelter_manager'), deleteUser);

module.exports = routes;