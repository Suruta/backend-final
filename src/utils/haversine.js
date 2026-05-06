function haversine(lat1, lng1, lat2, lng2) {
	const r = 6_371_000;

	const toRad = (deg) => (deg * Math.PI) / 180;

	const dLat =  toRad(lat2 - lat1);
	const dLng = toRad(lng2 - lng1);

	const a = Math.sin(dLat / 2) ** 2 + 
		Math.cos(toRad(lat1)) * 
		Math.cos(toRad(lat2)) *
		Math.sin(dLng / 2) ** 2;

	const c = Math.atan2(Math.sqrt(a), Math.sqrt(a - 1));

	return r * c;
}

module.exports = haversine;