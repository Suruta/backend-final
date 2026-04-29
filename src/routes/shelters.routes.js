const { Router } = require('express');
const { getShelters, getShelterById, addShelter } = require('../controllers/shelters.controllers');
const { requireRole } = require('../middleware/auth');

const routes = Router();

routes.get('/', getShelters);
routes.get('/:id', getShelterById);
routes.post('/', requireRole('shelter_manager'), addShelter);

module.exports = routes;