const bcrypt = require('bcryptjs');
const prisma = require('../lib/prisma');
const { signAccessToken } = require('../lib/jwt');

const SALT = 10;

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

const refreshToken = async (req, res) => {
	try {
		const { email } = req.body;

		const user = await prisma.user.findUnique({
			where: { email },
			select: { id: true, email: true, role: true }
		});

		const accessToken = signAccessToken(user);

		res.json({
			message: 'Token refreshed',
			accessToken,
			user: {
				id: user.id,
				email: user.email,
				role: user.role
			}
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: 'Failed to refresh token' });
	}
};

const logoutUser = async (req, res) => {
	try {
		const { email } = req.body;

		const user = await prisma.user.findUnique({
			where: { email }
		});
		if (!user) {
			return res.status(404).json({ msg: 'User not found' });
		}

		res.json({ msg: 'Logout successful' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: 'Failed to logout' });
	}
};

module.exports = {
	registerUser,
	loginUser,
	refreshToken,
	logoutUser
};
















