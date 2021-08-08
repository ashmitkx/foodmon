import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passport from 'passport';
import Users from '../models/user.js';

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/redirect'
        },
        async (accessToken, refreshToken, profile, done) => {
            profile = profile._json;
            let currentUser;

            // try to find user in users collection
            try {
                currentUser = await Users.findOne({ googleId: profile.sub });
            } catch (err) {
                done(err);
            }

            if (currentUser) return done(null, currentUser);

            // create new user if the users collection doesn't have the user
            try {
                currentUser = await new Users({
                    name: profile.name,
                    googleId: profile.sub,
                    imgUrl: profile.picture,
                    email: profile.email,
                    cart: [],
                    recent: []
                }).save();
            } catch (err) {
                done(err);
            }

            done(null, currentUser);
        }
    )
);

//  serialize the user.id into a cookie to send to browser
passport.serializeUser((user, done) => done(null, user.id));

// deserialize the cookie userId and look for a user in the database
passport.deserializeUser((id, done) =>
    Users.findById(id)
        .then(user => done(null, user))
        .catch(done)
);
