const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');
const { signAccessToken } = require('../lib/jwt');

const SALT = 10;

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
	modifyUser,
	deleteUser
};




















