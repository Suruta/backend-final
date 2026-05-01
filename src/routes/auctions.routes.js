const { Router } = require('express');
const { getAuctions, getAuctionById } = require('../controllers/auctions.controllers');

const routes = Router();

routes.get('/', getAuctions);
routes.get('/:id', getAuctionById);

module.exports = routes;