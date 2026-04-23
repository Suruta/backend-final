const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');

const SALT = 10;

const getUsers = async (req, res) => {};

const getUserById = async (req, res) => {};

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