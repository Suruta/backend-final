const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');

const SALT = 10;

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

const registerUser = async (req, res) => {
	try {
		const {email, password, role} = req.body;
		if (!email || !password) {
			return res.status(400).json({ msg: 'Email, password are required' });
		}

		const passwordHash = await bcrypt.hash(password, SALT);

		const user = await prisma.user.create({
			data: {
				email,
				passwordHash,
				role: role || 'consumer'
			}
		});

		res.json(user);
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: 'Failed to create user' });
	}
};

const loginUser = async (req, res) => {};

module.exports = {
	registerUser
};