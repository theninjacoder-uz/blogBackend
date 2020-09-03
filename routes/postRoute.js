const { Router } = require('express');
const Blog = require('../models/Blog');
const jwt = require('jsonwebtoken');
const config = require('../config/default.json');

const router = Router();

let privateId = '';
let cookieJwt = null;

// function for check and validate user
const checkUser = (cookeiName) => {
    try{
        const decodedToken = jwt.verify(cookeiName, config.jwtSecret);
        return decodedToken;
    }
    catch(err){
        throw Error('jwt is not valid');
    }
}

// create a post
// route /profile/make-post
router.post('/profile/make-post', async (req, res) => {
    // grab values from the request
    const { title, content, author } = req.body;
    
    cookieJwt = req.cookies.jwt;
    // identify user
    if(!cookieJwt){
        // redirect to the login page
        // should be written some codes :)
        res.status(404).send('Oops, You are not logged in');
    }
    else{
        // grab the jwt cookie
        const token = checkUser(cookieJwt);
        // if token is not exist or else
        if(!token){
            //redirect to login page
            // should be written some codes :)
            res.status(404).json({ token });
        } 
        else{
            
            privateId = JSON.stringify(token.id);
            
            try{
                const blog = await Blog.create({ privateId, title, content, author });
                res.status(200).json(blog);
            }
            catch(err){
                console.log(err);
            }
        }
    }
   
});

// get current user posts from DB 
// route /profile/all-posts
router.get('/profile/all-posts', async (req, res) => {
    
    cookieJwt = req.cookies.jwt;
    
    // identify user 
    if(!cookieJwt){
        // redirect to the login page
        // should be written some codes :)
        //res.status(404).send('Oops, something has happened wrong');
        throw Error('you are not logged in');
    }
    else{
        const token = checkUser(cookieJwt);
        if(!token){
            // redirect to the login page
            // should be written some codes :)
            //res.status(404).send('Oops, something has happened wrong');
            throw Error('invalid user identification')
        }    
        else{
            privateId = JSON.stringify(token.id);
            
            const blogs = await Blog.find({ privateId });
            res.status(200).json(blogs);
        }
    }
});

//get all created posts from DB
// route  /all-posts
router.get('/all-posts', async (req, res) => {
    try{
        const allBlogs = await Blog.find({});
        res.status(200).json(allBlogs);
    }
    catch (err){
        //res.send(400).send(err);
        throw Error('Oops, posts are not found');
    }
    
})

module.exports = router;