import { NextFunction, Request, Response } from "express"


const asyncErrorHandler = (fn : Function) => {
return(req : Request, res: Response, next: NextFunction)=>{
    fn(req,res,next).catch((err:Error)=>{
        return res.status(500).json({
            message : err.message,
            fullError : err
        })
    })
}
}


/* higher order function is a function jasle parameter ma arko function accept garxa
callback function jasle as a parameter arko function ma gairaxa


*/


export default asyncErrorHandler