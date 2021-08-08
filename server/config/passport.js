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
        (accessToken, refreshToken, profile, done) => {
            profile = profile._json;

            // find user in users collection
            Users.findOne({ googleId: profile.sub })
                .then(currentUser => {
                    if (currentUser) return currentUser;

                    // create new user if the users collection doesn't have the User
                    return new Users({
                        name: profile.name,
                        googleId: profile.sub,
                        imgUrl: profile.picture,
                        email: profile.email,
                        cart: [],
                        recent: []
                    }).save();
                })
                .then(user => done(null, user))
                .catch(done);
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
