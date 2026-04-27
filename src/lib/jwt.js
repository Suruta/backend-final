const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

function signAccessToken(user) {
	const payload = {
		sub: user.id,
		email: user.email,
		role: user.role
	};

	return jwt.sign(payload, JWT_SECRET, {
		expiresIn: JWT_EXPIRES_IN,
		issuer: 'backend-final-api',
		audience: 'backend-final-client'
	});
}

function verifyAccessToken(token) {
	try {
		return jwt.verify(token, JWT_SECRET, {
			issuer: 'backend-final-api',
			audience: 'backend-final-client'
		});
	} catch (error) {
		throw new Error('Invalid or expired token');
	}
}

module.exports = {
	signAccessToken,
	verifyAccessToken
};