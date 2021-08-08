import { Router } from 'express';
import passport from 'passport';

const router = Router();
const CLIENT_BASE_URL = process.env.CLIENT_BASE_URL;

// auth with google
router.route('/google').get(passport.authenticate('google', { scope: ['profile', 'email'] }));

// callback route for google to redirect to
router.route('/google/redirect').get(
    passport.authenticate('google', {
        successRedirect: CLIENT_BASE_URL,
        failureRedirect: CLIENT_BASE_URL
    })
);

// route where the client can check whether the user is logged in or not
router.get('/isauth', (req, res) => {
    if (req.user) res.json({ authenticated: true });
    else res.json({ authenticated: false });
});

// logout route
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect(CLIENT_BASE_URL);
});

export default router;
