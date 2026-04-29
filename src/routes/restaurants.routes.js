const { Router } = require('express');
const { requireRole } = require('../middleware/auth');
const { getRestaurants, addRestaurant, getRestaurantById, updateRestaurant, deleteRestaurant} = require('../controllers/restaurants.controllers');

const routes = Router();

routes.get('/', getRestaurants);
routes.get('/:id', getRestaurantById);
routes.post('/', requireRole('restaurant_owner'), addRestaurant);
routes.patch('/:id', requireRole('restaurant_owner'), updateRestaurant);
routes.delete('/:id', requireRole('restaurant_owner'), deleteRestaurant);

module.exports = routes;