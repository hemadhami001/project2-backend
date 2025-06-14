import { Request } from 'express'

interface IExtendedRequest extends Request {
    user : {
        id : string
    }
}