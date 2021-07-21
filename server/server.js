import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import restaurantsRoute from './routes/restaurants.js';
import dishesRoute from './routes/dishes.js';
import usersRoute from './routes/users.js';

// Express Setup
const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/v1/restaurants', restaurantsRoute);
app.use('/api/v1/dishes', dishesRoute);
app.use('/api/v1/users', usersRoute);
app.use('*', (_, res) => res.status(404).json({ msg: 'not found' }));

// Mongo Setup and Server startup
const PORT = process.env.PORT || 5000;
mongoose
    .connect('mongodb://localhost:27017/foodmon', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Connected to DB');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => console.error(err));
