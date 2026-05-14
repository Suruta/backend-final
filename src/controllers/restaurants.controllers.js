const prisma = require('../lib/prisma');

const getRestaurants = async (req, res) => {
	try {
		const restaurants = await prisma.restaurant.findMany();

		res.json({ count: restaurants.length, data: restaurants });
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: 'Failed to fetch Restaurants' });
	}
};

const addRestaurant = async (req, res) => {
	const ownerId = req.user.sub;
	const { name, address } = req.body;
	if (!name || !address || !ownerId) {
		return res.status(400).json({ msg: 'Name and address, ownerId are required' });
	}

	let restaurant = await prisma.restaurant.findUnique({
		where: { ownerId }
	});
	if (restaurant) {
		return res.status(400).json({ msg: 'Owner cannot have more than 1 restaurant!' });
	}

	restaurant = await prisma.restaurant.create({
		data: {
			name,
			address,
			ownerId
		}
	});

	res.status(201).json({
		message: 'Restaurant added successfully',
		restaurant
	});
};

const getRestaurantById = async (req, res) => {
	try {
		const restaurantId = parseInt(req.params.id);
		if (isNaN(restaurantId)) {
			res.status(400).json({ msg: 'Invalid type of restaurantId' });
		}

		const restaurant = await prisma.restaurant.findUnique({
			where: { id: restaurantId }
		});
		if (!restaurant) {
			return res.status(400).json({ msg: 'restaurant not found' });
		}

		res.json(restaurant);
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: 'Failed to fetch a restaurant' });
	}
};

const updateRestaurant = async (req, res) => {
	try {
		const restaurantId = parseInt(req.params.id);
		if (isNaN(restaurantId)) {
			return res.status(400).json({ msg: 'Invalid type of restaurantId' });
		}

		const { name, address } = req.body;

		const restaurant = await prisma.restaurant.update({
			where: { id: restaurantId },
			data: {
				name,
				address
			}
		});

		res.json(restaurant);
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: 'Failed ' });
	}
};

const deleteRestaurant = async (req, res) => {
	try {
		const restaurantId = parseInt(req.params.id);
		if (isNaN(restaurantId)) {
			return res.status(400).json({ msg: 'Invalid type of restaurantId' });
		}

		await prisma.restaurant.delete({
			where: { id: restaurantId }
		});

		res.status(204).send();
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: 'Failed to delete restaurant' });
	}
};

module.exports = {
	getRestaurants,
	addRestaurant,
	getRestaurantById,
	updateRestaurant,
	deleteRestaurant
};





















