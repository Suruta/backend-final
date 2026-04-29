const prisma = require('../lib/prisma');

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

const getAuditLogs = async (req, res) => {
	try {
		const { search } = req.query;
		where = {};

		if (search) {
			where.email = { contains: search, mode: 'insensitive' };
		}

		const actors = await prisma.auditLog.findMany({
			where
		});

		res.json({ count: actors.length, data: actors });
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: 'Failed to fetch audit logs' });
	}
};

module.exports = {
	getUsers,
	getUserById,
	getAuditLogs
};
















