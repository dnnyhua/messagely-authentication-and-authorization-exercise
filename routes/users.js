const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");
const User = require("../models/user");
const { json } = require("body-parser");


/** GET / - get list of users. Only logged in users can see the page
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/
router.get("/", ensureLoggedIn, async (req, res, next) => {
    try {
        const users = await User.all()
        return res.json(users)
    } catch (err){
        return next(err)
    }
})

/** GET /:username - get detail of users. Users can only view their own information.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/
router.get('/:username', ensureCorrectUser, async (req, res, next) => {
    const user = await User.get(req.params.username);
    return res.json({user})

})


/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

router.get('/:username/to', async (req, res, next) => {
    const messages  = await User.messagesTo(req.params.username)
    return res.json({messages})
})


/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

router.get('/:username/from', async (req, res, next) => {
    const messages  = await User.messagesFrom(req.params.username)
    return res.json({messages})
})


module.exports = router;
