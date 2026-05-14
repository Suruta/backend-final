const prisma = require('../lib/prisma');

const getInventories = async (req, res) => {
	try {
		const { restaurantId } = req.query;
		const id = parseInt(restaurantId);

		const where = {};

		if (restaurantId) {
			where.restaurantId = { id };
		}

		const inventories = await prisma.foodItem.findMany({
			where
		});

		res.json({ count: inventories.length, data: inventories});
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: 'Failed to fetch all Inventories' });
	}
};

const addInventory = async (req, res) => {
	try {
		const { name, desc, ingredients, bestPrice, currentPrice, status, restaurantId, availableQuantity, expiresAt, discountWindow, freeWindow } = req.body;
		// console.log(req.body);

		if (!name || !ingredients || !bestPrice || !currentPrice || !restaurantId || !expiresAt) {
			return res.status(400).json({ msg: 'Name, ingredients, bestPrice, currentPrice, restaurantId, expiresAt are required' });
		}

		const inventory = await prisma.foodItem.create({
			data: {
				name,
				desc,
				ingredients,
				bestPrice: parseFloat(bestPrice),
				currentPrice: parseFloat(currentPrice),
				status: status || 'fresh',
				restaurantId: parseInt(restaurantId),
				availableQuantity: parseInt(availableQuantity),
				expiresAt: new Date(expiresAt),
				discountWindow: new Date(discountWindow),
				freeWindow: new Date(freeWindow)
			}
		});

		res.status(201).json({
			message: 'Inventory was added successfully',
			inventory
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: 'Failed to add an inventory' });
	}
};

const getInventoryById = async (req, res) => {
	try {
		const inventoryId = parseInt(req.params.id);
		if (isNaN(inventoryId)) {
			return res.status(400).json({ msg: 'Invalid type of id' });
		}

		const inventory = await prisma.foodItem.findUnique({
			where: { id: inventoryId }
		});
		if (!inventory) {
			return res.status(400).json({ msg: 'Inventory not found'});
		}

		res.json(inventory);
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: 'Failed to fetch an inventory' });
	}
};

const updateInventory = async (req, res) => {
	try {
		const inventoryId = parseInt(req.params.id);
		if (isNaN(inventoryId)) {
			return res.status(400).json({ msg: 'Invalid type of id' });
		}

		const { name, desc, ingredients, bestPrice, currentPrice, status, restaurantId, availableQuantity, expiresAt, discountWindow, freeWindow } = req.body;

		const inventory = await prisma.foodItem.update({
			where: { id: inventoryId },
			data: {
				name,
				desc,
				ingredients,
				bestPrice: parseFloat(bestPrice),
				currentPrice: parseFloat(currentPrice),
				status,
				restaurantId: parseInt(restaurantId),
				availableQuantity: parseInt(availableQuantity),
				expiresAt: new Date(expiresAt),
				discountWindow: new Date(discountWindow),
				freeWindow: new Date(freeWindow)
			}
		});

		res.json(inventory);
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: 'Failed to update an inventory' });
	}
};

const deleteInventory = async (req, res) => {
	try {
		const inventoryId = parseInt(req.params.id);
		if (isNaN(inventoryId)) {
			return res.status(400).json({ msg: 'Invalid type of id' });
		}

		await prisma.foodItem.delete({
			where: { id: inventoryId }
		});

		res.status(204).send();
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: 'Failed to delete an inventory' });
	}
};

const addAuctionFlash = async (req, res) => {
	try {
		const foodItemId = parseInt(req.params.id);
		const { startTime, endTime, minBid } = req.body;

		if (isNaN(foodItemId)) {
			return res.status(400).json({ msg: 'Invalid type of id' });
		}

		if (!foodItemId || !startTime || !endTime || !minBid) {
			return res.status(400).json({ msg: 'foodItemId, startTime, endTime and minBid, bidderId are required' });
		}

		const flashAuction = await prisma.flashAuction.create({
			data: {
				foodItemId,
				startTime: new Date(startTime),
				endTime: new Date(endTime),
				minBid: parseInt(minBid)
			}
		});

		res.status(201).json({
			message: 'Flash auction created successfully',
			flashAuction
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: 'Failed to add an auction' });
	}
};

const deleteAuctionFlash = async (req, res) => {
	try {
		const auctionId = parseInt(req.params.id);
		if (isNaN(auctionId)) {
			return res.status(400).json({ msg: 'Invalid type of id' });
		}

		const flashAuction = await prisma.flashAuction.findUnique({
			where: {
				id: auctionId,
				bids: { none }
			}
		});
		if (!flashAuction) {
			return res.status(500).json({ msg: 'There are bids or this flash auction does not exist' });
		}

		await prisma.flashAuction.delete({
			where: { id: auctionId }
		});

		res.status(204).send();
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: 'Failed to delete an auction flash' });
	}
};

const addAuctionBid = async (req, res) => {
	try {
		const flashAuctionId = parseInt(req.params.id);
		const bidderId = req.user.sub;
		const { amount, quantity } = req.body;

		if (isNaN(flashAuctionId)) {
			return res.status(400).json({ msg: 'Invalid type of id' });
		}

		if (!flashAuctionId || !amount) {
			return res.status(400).json({ msg: 'AuctionId and amount are required' });
		}

		const auctionBid = await prisma.auctionBid.create({
			data: {
				auctionId: flashAuctionId,
				bidderId: parseInt(bidderId),
				amount: parseFloat(amount),
				quantity: parseInt(quantity)
			}
		});

		res.status(201).json({
			message: 'AuctionBid created successfully',
			auctionBid
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: 'Failed to add an auction bid' });
	}
};

// const winnerAuction = async(req, res) => {
// 	try {

// 	} catch (error) {
// 		console.error(error);
// 		res.status(500).json({ msg: '' });
// 	}
// };

module.exports = {
	getInventories,
	addInventory,
	getInventoryById,
	updateInventory,
	deleteInventory,
	addAuctionFlash,
	deleteAuctionFlash,
	addAuctionBid
}


















