const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')

function init(passport) {
    passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        //Login
        //check if email exists
        const user = await User.findOne({ email: email })
        if (!user) {
            return done(null, false, { message: 'No user with this email' })
        }

        // Assuming 'user' is fetched from your database based on username/email
        // 'user.password' should contain the plaintext password stored in your database

        if (user && user.password === password) {
            // Passwords match
            return done(null, user, { message: 'Logged in successfully' });
        } else {
            // Passwords do not match
            return done(null, false, { message: 'Wrong username or password' });
        }

    }))
     // this help to define what i store after login
    passport.serializeUser((user,done)=>{
        done(null,user._id)
    })

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });


}

module.exports = init