const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConf = require('../passport')

const passportLogIn = passport.authenticate('local', { session: false });
const passportGoogleOAuth = passport.authenticate('googleToken', { session: false });
const passportGetData = passport.authenticate('jwt', { session: false });


const { validateBody, schemas } = require('../helpers/route-helper');

const userController = require('../controllers/user');

router.route('/oauth/google')
    .post(passportGoogleOAuth, userController.googleOAuth);

router.route('/signup')
    .post(validateBody(schemas.authSchema), userController.signup);

router.route('/login')
    .post(validateBody(schemas.authSchema), passportLogIn, userController.login);

router.route('/getData')
    .get(passportGetData, userController.getData);

module.exports = router;