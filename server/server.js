import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import passport from 'passport';
import cookieSession from 'cookie-session';

import authRoutes from './routes/auth.js';
import restaurantsRoute from './routes/restaurants.js';
import dishesRoute from './routes/dishes.js';
import usersRoute from './routes/users.js';

// Passport setup
import './config/passport.js';

// Express setup
const app = express();

app.use(express.json());
app.use(
    cors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true // allow session cookie from browser to pass through
    })
);
app.use(
    cookieSession({
        name: 'session',
        maxAge: 24 * 60 * 60 * 1000,
        keys: [process.env.SESSION_COOKIE_KEY]
    })
);

// initialize passport and sessions
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);

// const authCheck = (req, res, next) => {
//     console.log('checking auth...');

//     if (req.user) return next();

//     res.status(401).json({
//         authenticated: false,
//         message: 'user has not been authenticated'
//     });
// };

// // if it's already login, send the profile response,
// // otherwise, send a 401 response that the user is not authenticated
// // authCheck before navigating to home page
// app.get('/', authCheck, (req, res) => {
//     res.status(200).json({
//         authenticated: true,
//         message: 'user successfully authenticated',
//         user: req.user,
//         cookies: req.cookies
//     });
// });

app.use('/api/v1/restaurants', restaurantsRoute);
app.use('/api/v1/dishes', dishesRoute);
app.use('/api/v1/users', usersRoute);
app.use('*', (req, res, next) => next({ status: 404 }));

// custom error handler
app.use((err, req, res, next) => {
    if (res.headersSent) return next(err);

    res.status(err.status || 500).json({ message: err.message || 'error' });
    console.log('Error:', err);
});

// Connect to mongo
mongoose
    .connect('mongodb://localhost:27017/foodmon', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connected to DB'))
    .catch(console.error);

// Server startup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
