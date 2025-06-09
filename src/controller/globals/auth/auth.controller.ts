
/*

REGISTER/SIGNUP
include information like username, email, password, and any other required fields
process the registration, save user data to the database, and send a confirmation email if necessary (checking for existing users, validating input, etc.)
db query to insert/update user data/read user data/delete user data

LOGIN
LOGOUT
FORGOT PASSWORD
RESET PASSWORD/OTP
UPDATE PROFILE
UPDATE PASSWORD




*/

import { Request, Response } from 'express'
import User from '../../../database/models/user.model'
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'


//json data --> req.body  //username, email, password, role
//files --> req.files //profile picture, documents, etc.
// const registerUser = async (req: Request, res: Response) => {

//     //   const username = req.body.username
//     //     const email = req.body.email
//     //     const password = req.body.password

//     const { username, email, password } = req.body
//     if (!username || !email || !password) {
//         res.status(400).json({
//             message: 'Username, email, and password are required.'
//         })


// } else {      //or  return
//     //insert user data into the database
//    await User.create({
//         username : username,
//         email: email,
//         password: password
//     })
//     res.status(200).json({
//         message: 'User registered successfully.'
//     })
// }
//  }  //function to register a user

/*
login flow : 
email, password, username, role

email, password -->data aacept--> validate user credentials
// first check email, password exist or not--> verify password -->match password --> generate token(jsonwebtoken) --> send token to client

login with email or username, github, google, facebook, etc.
email login(SSO) --> email, password --> validate user credentials
// if user exists, generate token and send it to the client
*/

class AuthController {
   static async registerUser(req:Request,res:Response){

    console.log("req.body")
       if(req.body === undefined){
        console.log("triggered")
        res.status(400).json({
            message : "No data provided"
        })
        return
    } 
    const {username,password,email} = req.body
    console.log("what's up")

    if(!username || !password || !email){
      res.status(400).json({
         message : "Please provide username, password, email"
     })
     return
    }

    const [data] =await User.findAll({
        where : {
            email
        }
    })
    if(data){
        // user already exists
    }




     // insert into Users table 
     await User.create({
         username :username, 
         password : bcrypt.hashSync(password, 12), 
         email : email
     })
     res.status(201).json({
         message : "User registered successfully"
     })
   }
   static async loginUser(req:Request,res:Response){
    const {email, password} = req.body
    if(!email || !password){
        res.status(400).json({
            message : "Please provide email and password"
        })
        return
    }
    //check if email exists in the database
    const data = await User.findAll({
        where : {
            email : email
        }
    })
     /*
     numbers = [1,2,3,4,5]
     numbers[0] = 1
     data = [
        {
            id: 1,
            username: 'hema',
            email: 'hema@gmail.com',
            password: '$2b$12$...'
            }]
      
        data[0].password    // $2b$12$... (hashed password)
        data[0].email         

     */
    // select * from Users where email = "hema@gmail.com"
    // return value in array

    if(data.length ==0){
        res.status(404).json({
            message : "Not registered yet, please register first"
        })
    }
    else{
        //check password
        // hamro diye ko password lai hash form ma convert garne kinvanne database ma hash form ma store gareko huncha
        // compare the password provided by the user with the hashed password in the database
        const isPasswordMatch = bcrypt.compareSync(password, data[0].password)
        if(isPasswordMatch){
            // login successful, token generate garne
            const token = jwt.sign({id : data[0].id},"secrets",{
                expiresIn : "90d" //expire after 90 days
            })
            res.json({
                token : token
            })
        }else{
            res.status(403).json({
                message: "Invalid credentials, please try again"
            })
        }
    }
   }
}

export default AuthController

// export {registerUser} 

