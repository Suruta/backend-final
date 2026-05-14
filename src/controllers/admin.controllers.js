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

// const triggerDecay = async (req, res) => {
// 	try {
// 		const now = new Date();
// 		let updated = 0;

// 		const toCompose = await prisma.foodItem.updateMany({
// 			where: {
// 				status: {
// 					not: 'compost'
// 				},
// 				expiresAt: {
// 					lte: now
// 				}
// 			},
// 			data: {
// 				status: 'compost',
// 				currentPrice: 0
// 			}
// 		});
// 		updated += toCompose.count;

// 		const toFree = await prisma.foodItem.updateMany({
// 			where: {
// 				status: {
// 					not: 'free'
// 				},
// 				freeWindow: {
// 					lte: now
// 				},
// 				expiresAt: {
// 					gt: now
// 				}
// 			},
// 			data: {
// 				status: 'free',
// 				currentPrice: 0
// 			}
// 		});
// 		updated += toFree.count;

// 		const toDiscounted = await prisma.foodItem.updateMany({
// 			where: {
// 				status: 'discounted',
// 				discountWindow: {
// 					lte: now
// 				},
// 				freeWindow: {
// 					gt: now
// 				}
// 			},
// 			data: {
// 				status: 'discounted'
// 			}
// 		});
// 		updated += toDiscounted.count;

// 		res.json({ count: updated });
// 	} catch (error) { 
// 		console.error(error);
// 		res.status(500).json({ msg: 'Failed to call price recalculation function' });
// 	}
// };

module.exports = {
	getAuditLogs,
	triggerDecay
};
















