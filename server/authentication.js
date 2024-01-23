const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User=require('./userModel')

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRET,
    callbackURL: '/auth/google/callback',
  },
  async (accessToken, refreshToken, profile, done) => {

    let user = await User.findOne({ googleId: profile.id })
    .populate({
    path: 'documents',
    select: 'name', 
     });

    if(!user){
        user=await User.create({
            googleId:profile.id,
            name:profile.displayName,
            email:profile.emails[0].value
        })
    }

    return done(null, user);
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
};

module.exports = { passport, isAuthenticated };
