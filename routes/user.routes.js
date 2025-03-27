const express = require ('express') ;
const router = express.Router () ;
const { body, validationResult } = require ('express-validator')

const userModel = require('../models/user.model')
const bcrpyt = require('bcrypt')
const jwt = require ('jsonwebtoken')

router.get('/register' , (req , res)=> {
    res.render ('register.ejs')
 
})

router.post ('/register',
    body('email').trim ().isEmail().isLength({min : 12 }),
    body('password').trim().isLength ({min: 5}),
    body('username').trim().isLength ({min: 3}),
   async (req,res) => {
    
    const errors = validationResult (req) ;
    
    if ( ! errors.isEmpty () ) {
        return res.status (400).json({
            errors: errors.array() ,
            message: 'Invalid data'
        })
    }
    
   const {email , username , password } = req.body;

   const hashedPassword = await bcrpyt.hash(password , 5) 

   const newUser = await userModel.create ({
    email , 
    username , 
    password : hashedPassword 
   })

   res.json(newUser)
    
})

router.get ('/login' , (req,res)=>{
    res.render ('login.ejs')
})

router.post ( '/login' , 
    body('username').trim().isLength({min:3}) ,
    body('password').trim().isLength({min: 5}) ,
    async (req,res) => {
        const errors = validationResult(req) ;

        if (!errors.isEmpty()) {
            return res.status(400).json({
                error:errors.array() ,
                message: 'Invalid data' 
            })
        }
        const {username , password} = req.body ;
        const user = await userModel.findOne({
            username : username 
        })

        if (!user) {
            return res.status(400).json ({
                message: 'Username or password is incorrect' 
            })
        }

        const isMatch = await bcrpyt.compare (password , user.password) ;

        if(!isMatch) {
            return res.status(400).json ({
                message: 'Username or password is incorrect' 
            })
        }

        const token = jwt.sign ({
            userId : user._id ,
            email: user.email,
            username: user.username
        },
        process.env.JWT_SECRET,
    )
    res.json ({
        token
    })
    }
 )

module.exports = router ;