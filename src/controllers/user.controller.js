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
			return res.status(400).json({ msg: 'Invalid type of user id' });
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

		const user = await prisme.user.update({
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

		await prisma.user.delete({
			where: { id: userId}
		});

		res.status(204).send();
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: 'Failed to delte user'})
	}
};

module.exports = {
	getUsers,
	getUserById,
	modifyUser,
	deleteUser
};




















