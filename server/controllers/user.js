const UserSchema = require('../models/user');
const JWT = require('jsonwebtoken');

signToken = user => {
    return token = JWT.sign({
        iss: 'ISSUER NAME HERE',
        sub: user._id,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1)
    }, 'CHANGE TO YOUR SECRET SALT HERE')
}

module.exports = {
    signup: async (req, res, next) => {
        const email = req.value.body.email;
        const password = req.value.body.password;
        const UserExit = UserSchema.findOne({ "local.email": email }).then(response => {
            if (response) {
                return res.json({
                    status: 403,
                    message: "User Already Exist!"
                });
            }
            else {
                const newUser = new UserSchema({
                    method: 'local',
                    local: {
                        email: email,
                        password: password
                    }
                });

                newUser.save().then(result => {
                    if (result) {
                        const token = signToken(result);
                        res.json({
                            status: 200,
                            message: "User saved",
                            token: token
                        });
                    }
                });
            }
        });
    },

    googleOAuth: async (req, res, next) => {

        console.log("GOOGLE AUTH CONT: ", req.user);
        const token = signToken(req.user);
        res.json({
            status: 200,
            message: "User Signed In via Google!",
            token: token
        });
    },

    login: async (req, res, next) => {
        const token = signToken(req.user);
        res.json({
            status: 200,
            token: token,
            message: "Successful Log In!"
        });
    },

    getData: async (req, res, next) => {
        res.json({
            status: 200,
            message: {
                FName: "Kishan",
                LName: "Kankhara"
            }
        })
    }

}