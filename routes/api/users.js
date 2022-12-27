const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {check, validationResult} = require("express-validator");

const User = require("../../models/Users");

//route GET api/users
//Register user
//access Public 
router.post("/",[
    check('name', 'Name is required')
    .not()
    .isEmpty(),
    check('email','Please include a validate email').isEmail(),
    check('password','Please enter a password with 6 or more characters')
    .isLength({min : 6})
],
async(req,res)=>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()});
    }

    const {name, email, password} = req.body;

    try {

        let user = await User.findOne({email});

        if(user){
         return res.status(400).json({errors : [{msg : 'User already exists'}]});
        }

        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        }) 

        user = new User({
            name,
            email,
            avatar,
            password
        });
        
        user.password = await bcrypt.hash(password, 10);

        await user.save();
        
        const payload = {
            user : {
                id : user.id
            }
        }

        jwt.sign(payload,
            "Loremipsumdolorsitametconsecteturadipisicing",
            {expiresIn : 360000},
            (err,token) =>{
                if(err) throw err;
                res.json({token});
            });

    //   res.send("User Registered");
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
    
})

module.exports = router;