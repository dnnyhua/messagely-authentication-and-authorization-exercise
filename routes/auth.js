const express = require("express");
// const Router = require("express").Router;
const router = new express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const ExpressError = require("../expressError");
const { SECRET_KEY } = require("../config");



/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/

router.post('/login', async (req, res, next) => {
    try{
        const {username, password} = req.body;
        if (await User.authenticate(username, password)) {
            let token = jwt.sign({username}, SECRET_KEY);
            User.updateLoginTimestamp(username);
            return res.json({token})
        } else {
            throw new ExpressError("invalid credentials", 400)
        }
    } catch(err) {
        return next(err)
    }
})



/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */

router.post('/register', async (req, res, next) => {
    try {
        // const {username, password, first_name, last_name, phone} = req.body;
        // let newUser = await User.register(username, password, first_name, last_name, phone)

        // Why does the code above not pass the test?
        let newUser = await User.register(req.body);
        const token = jwt.sign({username:newUser.username}, SECRET_KEY)
        User.updateLoginTimestamp(newUser.username)
        // console.log(token)
        return res.json({token});
    } catch(err){
        return next(err)
    };
   
});



module.exports = router;