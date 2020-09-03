const { Router } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/default.json');
const handleErrors = require('./handleErrors');

const router = Router();
// create Json Web Token
const createToken = (id) => {
    return jwt.sign({ id }, config.jwtSecret, {
        expiresIn: 365 * 24 * 60 * 60
    })
} 


// SIGN UP post request
// route /auth/signup

router.post('/signup', async (req, res) => {
    
    // grap user's email and password from the request
    const { email, password } = req.body;

    // save user's data in MongoDB
    try{
        const user = await User.create({ email, password });
        //create jwt
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: 365 * 24 * 60 * 60 * 1000});
        res.status(200).json({ user });
    }
    catch(err){
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
});

//LOGIN post request 
//route /auth/login
router.post('/login', async (req, res) => {
    
    // grap user's email and password from the request
    const { email, password } = req.body;

    // check User exist and valid
    try{

        const user = await User.login(email, password);
        // create jwt
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: 365 * 24 * 60 * 60 * 1000});
        
        res.status(200).json({ token });
    }
    catch(err){
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
});

// LOG OUT get

router.get('/logout', (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    // redirect to the home page
    // should be written some codes :)
    res.status(200).send('you are logged out');
});

module.exports = router;