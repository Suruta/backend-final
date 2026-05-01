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
		const { name, desc, ingredients, bestPrice, currentPrice, status, restaurantId, expiresAt, discountWindow, freeWindow } = req.body;
		if (!name || !ingredients || bestPrice || !currentPrice || !status || !restaurantId || !expiresAt) {
			return res.status(400).json({ msg: 'Name, ingredients, bestPrice, currentPrice, status, restaurantId, expiresAt are required' });
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

		const { name, desc, ingredients, bestPrice, currentPrice, status, restaurantId, expiresAt, discountWindow, freeWindow } = req.body;

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

module.exports = {
	getInventories,
	addInventory,
	getInventoryById,
	updateInventory,
	deleteInventory
}


















