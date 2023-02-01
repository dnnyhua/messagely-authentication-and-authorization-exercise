const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");
const Message = require("../models/message");
const { json } = require("body-parser");


/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/

router.get("/:id", ensureLoggedIn, async (req, res, next) => {
    try{
        
        let username = req.user.username;
        let message = await Message.get(req.params.id)

        // this logic only allows the person who sent the message and the person who is receiving the message sees it
        if (message.to_user.username !== username && message.from_user.username !== username){
            throw new ExpressError("Cannot access message", 401);
        }
        return res.json({message : message})

    } catch (err){
        return next(err);
    };
})

  
/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/

router.post("/", ensureLoggedIn, async (req, res, next) => {
    let message = await Message.create({
        from_username: req.user.username, 
        to_username: req.body.to_username, 
        body: req.body.body
    });
    return res.json({message: message});
})




/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/


module.exports = router;
