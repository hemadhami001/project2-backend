// multer confriguration


import { Request } from "express"
import multer from "multer"
import { IExtendedRequest } from "./type"


const storage = multer.diskStorage({
    //destination function says where we store incoming location
    destination : function(req : Request, file : Express.Multer.File, cb : any){
       cb(null,'./src/storage')
    },
    // mathi ko location diye paxi k name ma rakne vanxa (modify)
    filename : function(req : Request, file : Express.Multer.File, cb : any){
       cb(null,Date.now() + "-" + file.originalname)
    }
})

export {multer, storage}


/*
any file --> multer --> location(storage) --> heloo.pdf

*/