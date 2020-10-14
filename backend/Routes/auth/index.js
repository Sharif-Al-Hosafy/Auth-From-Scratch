const express = require("express");
const Joi = require('joi');

const router = express.Router();

const User = require('../../db/users');

const schema = Joi.object({
    username: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9_]+$'))
        .min(3)
        .max(30)
        .required(),

    password: Joi.string()
        .min(10).required()
})

router.get('/', (req, res)=>{
    res.json({
        message:"Get auth"
    }) 
})

router.post('/signup', (req, res)=>{
    const result = schema.validate(req.body);
    res.json(result)
})
module.exports = router;