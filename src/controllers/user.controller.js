const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');
const { signAccessToken } = require('../lib/jwt');
const { requireAuth } = require('../middleware/auth');

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
		if (password.length < 6) {
			return res.status(400).json({ msg: 'Password must be at least 6 characters'});
		}

		const existingUser = await prisma.user.findUnique({
			where: {email}
		});
		if (existingUser) {
			return res.status(400).json({ msg: 'Email already registered'});
		}

		const passwordHash = await bcrypt.hash(password, SALT);

		const user = await prisma.user.create({
			data: {
				email,
				passwordHash,
				role: role || 'consumer'
			}
		});

		const accessToken = signAccessToken(user);

		res.status(201).json({
			message: 'User registered successfully',
			accessToken,
			user
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: 'Failed to create user' });
	}
};

const loginUser = async (req, res) => {
	try {
		const {email, password} = req.body;
		if (!email || !password) {
			return res.status(400).json({ msg: 'Email and password are required' });
		}

		const user = await prisma.user.findUnique({
			where: { email }
		});
		if (!user) {
			return res.status(400).json({ msg: 'Invalid credentials' });
		}

		const isValidPassword = await bcrypt.compare(password, user.passwordHash);
		if (!isValidPassword) {
			return res.status(401).json({ msg: 'Invalid credentials' });
		}

		const accessToken = signAccessToken(user);

		res.json({
			message: 'Login successful',
			accessToken,
			user: {
				id: user.id,
				email: user.email,
				role: user.role
			}
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: 'Failed to login' });
	}
};

module.exports = {
	getUsers,
	getUsersById,
	registerUser,
	loginUser
};




















