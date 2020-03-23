const passport = require('passport');
const jwt = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const UserSchema = require('./models/user');
const localStrategy = require('passport-local').Strategy;
const googlePlusTokenStrategy = require('passport-google-plus-token');

//JWT STRATEGY
passport.use(new jwt({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: 'Change to Your Secret'
}, (payload, done) => {
    try {
        UserSchema.findById(payload.sub).then(result => {
            if (!result) {
                return done(null, false);
            }
            else {
                done(null, result);
            }
        });


    } catch (error) {
        console.log("ERROR: ", error);
    }

}));

//GOOGLE OAUTH STRATEGY
passport.use('googleToken', new googlePlusTokenStrategy({
    clientID: 'Change to Your Client ID of Google OAuth v2 API',
    clientSecret: 'Change to Your Client Secret of Google OAuth v2 API'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        UserSchema.findOne({ "google.id": profile.id }).then(userExist => {
            if (userExist) {
                console.log("User Already Exist!", userExist);
                return done(null, userExist);
            }
            else {
                console.log("Creating a USER!!");
                const newUser = new UserSchema({
                    method: 'google',
                    google: {
                        id: profile.id,
                        email: profile.emails[0].value
                    }
                });

                newUser.save().then(result => {
                    done(null, newUser)
                });
            }
        });
    } catch (error) {
        done(error, false)
    }

}));



//LOCAL STRATEGY
passport.use(new localStrategy({
    usernameField: 'email'
}, (email, password, done) => {
    try {
        console.log(password);
        
        UserSchema.findOne({ "local.email": email }).then(result => {
            console.log(result);
            
            if (!result) {
                return done(null, false);
            }
            else {
                result.isValidPassword(password).then(response => {
                    console.log(response);
                    
                    if (!response) {
                        return done(null, false);
                    }
                    else {
                        done(null, result);
                    }
                });
            }
        });

    } catch (error) {
        done(error, false);
    }
}))