const prisma = require('../lib/prisma');

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
	getAuditLogs
};
















