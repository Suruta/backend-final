const express = require('express');
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const restaurantRoutes = require('./routes/restaurants.routes');
const shelterRoutes = require('./routes/shelters.routes');

const app = express();

const currPort = process.env.PORT || 8000;

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes); // todo
app.use('/api/admin', adminRoutes); // todo
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/shelters', shelterRoutes);

app.listen(currPort, () => {
	console.log(`Server is running on localhost:${currPort}`);
});