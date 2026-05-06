const { Router } = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const { getInventories, addInventory, getInventoryById, updateInventory, deleteInventory } = require('../controllers/inventory.controllers');

const routes = Router();

routes.get('/', getInventories);
routes.post('/', requireAuth, requireRole('restaurant_owner'), addInventory);
routes.get('/:id', getInventoryById);
routes.patch('/:id', requireAuth, requireRole('restaurant_owner'), updateInventory);
routes.delete('/:id', requireAuth, requireRole('restaurant_owner'), deleteInventory);

module.exports = routes;