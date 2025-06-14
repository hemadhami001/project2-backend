import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../database/models/user.model'

interface IExtendedRequest extends Request {
    user ? : {
       email: string,
       role: string,
       username: string | null 
    }
}


class Middleware {
    static async isLoggedIn (req:IExtendedRequest, res:Response, next:NextFunction) :Promise<void> {
      // Check if user is logged in or not
      // token accept garne, token ko user id check garne, user id database ma xa ki xaina bhanera
      // console.log("IsLoggedIn middleware triggered")

      // const name = "hema dhami"
      const token = req.headers.authorization  //jwt
      console.log(token, "TOKEN")
      if (!token) {
         res.status(401).json({
            message: "Unauthorized:  Please provide a token"
        })
        return
      }
      //verify token and get user id
      jwt.verify(token, 'secrets',async (erroraayo, resultaayo : any)=>{
        if (erroraayo){
            res.status(403).json({
                message: "Unauthorized: Invalid token"
            })
        }else{
            //verification successful

            // const userData = await User.findAll({
            //     where : {
            //         id : resultaayo.id
            //     }
            // })
            const userData = await User.findByPk(resultaayo.id)
            if (!userData){
                res.status(403).json({
                    message: "No user found with this id,invalid token"
                })
            }else{
            //    req.user = {
            //     name : "hema dhami",
            //     age : 22
            //    }

            req.user = userData
                next()
            }
        }
      })
    }

    static restrictTo(req:Request, res:Response, next:NextFunction){

    }
}

export default Middleware;