const prisma = require('../lib/prisma');

const getAuctions = async (req, res) => {
	try {
		const now = new Date();

		const auctions = await prisma.flashAuction.findMany({
			where: {
				endTime: { gt: now },
				startTime: { lt: now },
				bids: { some: {} }
			}
		});
		if (!auctions) {
			return res.status(400).json({ msg: 'No active auctions or no bids' });
		}

		res.json({ count: auctions.length, data: auctions });
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: 'Failed to fetch auctions' });
	}
};

const getAuctionById = async (req, res) => {
	try {
		const auctionId = parseInt(req.params.id);
		if (isNaN(auctionId)) {
			return res.status(400).json({ msg: 'Invalid type of id' });
		}

		const auction = await prisma.flashAuction.findUnique({
			where: { id: auctionId }
		});
		if (!auction) {
			res.status(400).json({ msg: 'Auction not found' });
		}

		res.json(auction);
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: 'Failed to fetch a auction' });
	}
};

module.exports = {
	getAuctions,
	getAuctionById
};















