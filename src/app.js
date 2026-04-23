const express = require('express');
const userRoutes = require('./routes/user.routes');

const app = express();

const currPort = process.env.PORT || 8000;

app.use(express.json());

app.use('/api/users', userRoutes);

app.listen(currPort, () => {
	console.log(`Server is running on localhost:${currPort}`);
});