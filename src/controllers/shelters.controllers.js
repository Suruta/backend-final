const prisma = require('../lib/prisma');

const getShelters = async (req, res) => {
	try {
		const shelters = await prisma.shelter.findMany();

		res.json({ count: shelters.length, data: shelters });
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: 'Failed to fetch shelters' });
	}
};

const addShelter = async (req, res) => {
	try {
		const { name, lat, lng, managerId } = req.body;
		if (!name || !lat || !lng || !managerId) {
			return res.status(400).json({ msg: 'Name, lat, lng, managerId are required' });
		}

		let shelter = await prisma.shelter.findUnique({
			where: { managerId: parseInt(managerId)}
		});
		if (shelter) {
			return res.status(400).json({ msg: 'Shelter manager cannot have more than 1 shelter!' });
		}

		shelter = await prisma.shelter.create({
			data: {
				name,
				lat: parseFloat(lat),
				lng: parseFloat(lng),
				managerId: parseInt(managerId)
			}
		});

		res.status(201).json({
			message: 'Shelter added successfully',
			shelter
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: 'Failed to add a shelter' });
	}
};

const getShelterById = async (req, res) => {
	try {
		const shelterId = parseInt(req.params.id);
		if (isNaN(shelterId)) {
			return res.status(400).json({ msg: 'Invalid type of shelterId' });
		}

		const shelter = await prisma.shelter.findUnique({
			where: { id: shelterId }
		});
		if (!shelter) {
			return res.status(400).json({ msg: 'shelter not found' });
		}

		res.json(shelter);
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: 'Failed to fetch a shelter' });
	}
};

module.exports = {
	getShelters,
	addShelter,
	getShelterById
};



























// Suruta