const express = require('express');

const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');

const restaurantRoutes = require('./routes/restaurants.routes');
const shelterRoutes = require('./routes/shelters.routes');
const inventoryRoutes = require('./routes/inventory.routes');
const auctionRoutes = require('./routes/auctions.routes');
const logisticRoute = require('./routes/logistics.routes');

const app = express();

const currPort = process.env.PORT || 8000;

app.use(express.json());

app.use('/api/users', userRoutes); // todo almost done
app.use('/api/auth', authRoutes); // todo, almost done 
app.use('/api/admin', adminRoutes); // todo
app.use('/api/restaurants', restaurantRoutes); // done
app.use('/api/shelters', shelterRoutes); // done
app.use('/api/inventory', inventoryRoutes); //done
app.use('/api/auctions', auctionRoutes); // done
app.use('/api/logistics', logisticRoute); // done

app.listen(currPort, () => {
	console.log(`Server is running on localhost:${currPort}`);
});