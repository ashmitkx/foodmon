import { Router } from 'express';
import passport from 'passport';

const router = Router();
const CLIENT_BASE_URL = process.env.CLIENT_BASE_URL;

// // when login is successful, retrieve user info
// router.get('/login/success', (req, res) => {
//     console.log('route: /login/success');

//     if (req.user) {
//         res.json({
//             success: true,
//             message: 'user has successfully authenticated',
//             user: req.user,
//             cookies: req.cookies
//         });
//     }
// });

// // when login failed, send failed msg
// router.get('/login/failed', (req, res) => {
//     console.log('route: /login/failed');

//     res.status(401).json({
//         success: false,
//         message: 'user failed to authenticate.'
//     });
// });

// When logout, redirect to client
router.get('/logout', (req, res) => {
    console.log('route: /login/logout');

    req.logout();
    res.redirect(CLIENT_HOME_PAGE_URL);
});

// auth with google
router.route('/google').get(passport.authenticate('google', { scope: ['profile', 'email'] }));

// callback route for google to redirect to
router.route('/google/redirect').get(
    passport.authenticate('google', {
        successRedirect: '/app',
        failureRedirect: '/login'
    })
);

export default router;
