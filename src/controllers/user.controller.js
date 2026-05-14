const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');
const { signAccessToken } = require('../lib/jwt');

const getUsers = async (req, res) => {
	try {
		const { role, search } = req.query;

		const where = {};
		if (role) where.role = role;
		if (search) {
			where.name = { contains: search, mode: 'insensitive' };
		}

		const users = await prisma.user.findMany({
			where
		});

		res.json({ count: users.length, data: users });
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: 'Failed to fetch users' });
	}
};

const getUserById = async (req, res) => {
	try {
		const userId = parseInt(req.params.id);
		if (isNaN(userId)) {
			return res.status(400).json({ msg: 'Invalid type of userId' });
		}

		const user = await prisma.user.findUnique({
			where: { id: userId }
		});

		res.json(user);
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: 'Failed to fetch a user' });
	}
};

const modifyUser = async (req, res) => {
	try {
		const targetUserId = parseInt(req.params.id);
		const currUserId = req.user.sub;
		const currUserRole = req.user.role;

		if (targetUserId !== currUserId && currUserRole !== 'restaurant_owner') {
			return res.status(403).json({ msg: 'You can only update your own profile' });
		}

		const userId = parseInt(req.params.id);
		const { email, role } = req.body;

		const user = await prisma.user.update({
			where: { id: userId},
			data: {
				email,
				role
			}
		});

		res.json(user);
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: 'Failed to update user'})
	}
};

const deleteUser = async (req, res) => {
	try {
		const userId = parseInt(req.params.id);

		await prisma.profile.delete({
			where: { userId }
		});
		await prisma.allergyProfile.delete({
			where: { userId }
		});
		await prisma.user.delete({
			where: { id: userId}
		});

		res.status(204).send();
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: 'Failed to delete user'})
	}
};

const getUserProfile = async (req, res) => {
	try {
		const myId = req.user.sub;

		const profile = await prisma.profile.findUnique({
			where: { userId: myId }
		});
		if (!profile) {
			return res.status(400).json({ msg: 'First, create a profile' });
		}

		res.json(profile);
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: 'Failed to fetch user profile' });
	}
};

const updateUserProfile = async (req, res) => {
	try {
		const myId = req.user.sub;
		const { name, phone } = req.body;

		const profile = await prisma.profile.update({
			where: { userId: myId },
			data: {
				name,
				phone
			}
		});

		res.json(profile);
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: 'Failed to update user profile' });
	}
};

const getUserAllergyProfile = async (req, res) => {
	try {
		const myId = req.user.sub;

		const allergyProfile = await prisma.allergyProfile.findUnique({
			where: { userId: myId }
		});
		if (!allergyProfile) {
			return res.status(400).json({ msg: 'First, create allergy profile' });
		}

		res.json(allergyProfile);
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: 'Failed to fetch user allergy profile' });
	}
};

const updateUserAllergyProfile = async (req, res) => {
	try {
		const myId = req.user.sub;
		const { allergens, severity } = req.body;
		const mySeverity = parseInt(severity);

		const allergyProfile = await prisma.allergyProfile.update({
			where: { userId: myId },
			data: {
				allergens,
				severity: mySeverity
			}
		});

		res.json(allergyProfile);
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: 'Failed to update user allergy profile' });
	}
};

const getConsumerBids = async (req, res) => {
	try {
		const myId = req.user.sub;

		const bids = await prisma.auctionBid.findMany({
			where: {
				bidderId: myId
			},
			include: {
				auction: true,
				bidder: true
			}
		});
		if (!bids) {
			return res.status(400).json({ msg: 'There are no bid for this user' });
		}

		res.json({ count: bids.length, data: bids });
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: 'Failed to fetch consumer bid' });
	}
};

module.exports = {
	getUsers,
	getUserById,
	modifyUser,
	deleteUser,
	getUserProfile,
	updateUserProfile,
	getUserAllergyProfile,
	updateUserAllergyProfile,
	getConsumerBids
};




















