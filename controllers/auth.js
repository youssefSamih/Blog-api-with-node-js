const jwt = require('jsonwebtoken')
require('dotenv').config()
const expressJwt = require("express-jwt")
const User = require('../models/user')
const _ = require("lodash")
const { sendEmail } = require('../helpers')
const dotenv = require("dotenv")
dotenv.config()

exports.signup = async (req, res) => {
    const userExists = await User.findOne({email: req.body.email})
    if (userExists) return res.status(403).json({
        error: "Email is taken !"
    })
    const user = await new User(req.body)
    await user.save()
    res.status(200).json({message: "Signup success ! Please Login"})
}

exports.sigin = (req, res) => {
    const {email, password} = req.body
    User.findOne({email}, (err, user) => {
        if(err || !user) {
            return res.status(401).json({
                error: "User with that email does not exist, Please signin"
            })
        }
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: "Email and password do not match"
            })
        }
        const token = jwt.sign({_id: user._id, role: user.role}, process.env.JWT_SECRET)
        res.cookie('t', token, {expire: new Date() + 9999})
        const {_id, name, email, role} = user
        return res.json({token, user: {_id, email, name, role}})
    })
}

exports.signout = (req, res) => {
    res.clearCookie("t")
    return res.json({message: "SignOut success !"})
}

exports.requireSingin = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: "auth"
})

exports.forgotPassword = (req, res) => {
    if(!req.body) return res.status(400).json({message: "No request body"})
    if(!req.body.email)
        return res.status(400).json({message: "No Email in request body"})

    console.log("forgot password finding user with that email")
    const {email} = req.body
    console.log("signin req.body", email)
    User.findOne({email}, (err, user) => {
        if(err || !user) 
            return res.status("401").json({error: "User with that email does not exist !"})
        const token = jwt.sign(
            {_id: user._id, iss: "NODEAPI"},
            process.env.JWT_SECRET
        )

        const emailData = {
            from : "noreply@nodereact.com",
            to: email,
            subject: "Password Reset Instruction",
            text: `<p>Please use the following link to reset your password: ${
                process.env.CLIENT_URL
            }/reset-password/${token}<p>`
        }

        return user.updateOne({ resetPasswordLink: token }, (err, success) => {
            if(err) {
                return res.json({message : err})
            } else {
                sendEmail(emailData)
                return res.status(200).json({
                    message: `Email has been sent to ${email}. Follow the instructions to reset ypur Password`
                })
            }
        })
    })
}

exports.resetPassword = (req, res) => {
    const { resetPasswordLink, newPassword } = req.body
    User.findOne({resetPasswordLink}, (err, user) => {
        if(err || !user)
            return res.status(401).json({
                error: "Invalid Link !"
            })
        
        const updateFields = {
            password: newPassword,
            resetPasswordLink: ""
        }

        user = _.extend(user, updateFields)
        user.updated = Date.now()

        user.save((err, result) => {
            if(err) {
                return res.status(400).json({
                    error: err
                })
            }
            res.json({
                message: `Great! Now you can login with your new password`
            })
        })
    })
}

exports.socialLogin = (req, res) => {
    let user = User.findOne({ email: req.body.email }, (err, user) => {
        if(err || !user) {
            user = new User(req.body)
            req.profile = user
            user.save()
            const token = jwt.sign({id: user._id, iss:"NODEAPI"}, process.env.JWT_SECRET)
            res.cookie("t", token, {expire: new Date() + 9999})
            const {_id, name, email} = user
            return res.json({token, user: {_id, name, email, role}})
        } else {
            req.profile = user
            user = _.extend(user, req.body)
            user.updated = Date.now()
            user.save()
            const token = jwt.sign({_id: user._id, iss: "NODEAPI"}, process.env.JWT_SECRET)
            res.cookie("t", token, {expire: new Date() + 9999})
            const {_id, name, email, role} = user
            return res.json({token, user: {_id, name, email, role }})
        }
    })
}