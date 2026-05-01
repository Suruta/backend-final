const { Router } = require('express');
const { requireRole } = require('../middleware/auth');
const { getInventories, addInventory, getInventoryById, updateInventory, deleteInventory } = require('../controllers/inventory.controllers');

const routes = Router();

routes.get('/', getInventories);
routes.post('/', requireRole('restaurant_owner'), addInventory);
routes.get('/:id', getInventoryById);
routes.patch('/:id', requireRole('restaurant_owner'), updateInventory);
routes.delete('/:id', requireRole('restaurant_owner'), deleteInventory);

module.exports = routes;