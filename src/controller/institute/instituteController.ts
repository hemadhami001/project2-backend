import { NextFunction, Request, Response } from 'express';
import sequelize from '../../database/connection';
import generateRandominstituteNumber from '../../services/generateRandominstituteNumber';

interface IExtendedRequest extends Request {
    user?: {
        name: string,
        age: number
    }
}

class InstituteController {
    // console.log("Triggered InstituteController")
    static async createInstitute(req:IExtendedRequest, res:Response, next : NextFunction) {
        console.log(req.user, "Name from middlieware")
        const {instituteName, instituteEmail, institutePhoneNumber, instituteAddress} = req.body
        const instituteVatNo = req.body.instituteVatNo || null
        const institutePanNo = req.body.institutePanNo || null
        if (!instituteName || !instituteEmail || !institutePhoneNumber || !instituteAddress) {
         res.status(400).json({
                message: "Please provide all required fields: instituteName, instituteEmail, institutePhoneNumber, instituteAddress"
            })
            return
        }

        // all data aayo vane --> intitute create garne

        const instituteNumber = generateRandominstituteNumber()



        await sequelize.query(`
        CREATE TABLE IF NOT EXISTS institute_${instituteNumber} (
        id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        instituteName VARCHAR(255) NOT NULL,
        instituteEmail VARCHAR(255) NOT NULL,
        institutePhoneNumber VARCHAR(15) NOT NULL UNIQUE,
        instituteAddress VARCHAR(255) NOT NULL,
        institutePanNo VARCHAR(20),
        instituteVatNo VARCHAR(20),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`)

    await sequelize.query(`INSERT INTO institute_${instituteNumber} (instituteName, instituteEmail,
         institutePhoneNumber, instituteAddress, institutePanNo, instituteVatNo) VALUES(?,?,?,?,?,?)`,
         {
           replacements : [instituteName, instituteEmail, institutePhoneNumber, instituteAddress,
            institutePanNo, instituteVatNo
           ] 
         })

        // await sequelize.query(`CREATE TABLE teacher_${instituteNumber} (
        //     id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        //     teacherName VARCHAR(255) NOT NULL,
        //     teacherEmail VARCHAR(255) NOT NULL UNIQUE,
        //     teacherPhoneNumber VARCHAR(255) NOT NULL UNIQUE
        //     )`) 

       next() // call next middleware

    }
}

// const createTeacherTable = async (req: Request, res: Response)=>{
//     // await sequelize.query(`CREATE TABLE taecher_${instituteNumber} (
//     //     id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
//     //     teacherName VARCHAR(255) NOT NULL,
//     //     teacherEmail VARCHAR(255) NOT NULL UNIQUE,
//     //     teacherPhoneNumber VARCHAR(255) NOT NULL UNIQUE
//     //     )`)
// }

export default InstituteController