import { Request, Response } from 'express';
import sequelize from '../../database/connection';
import generateRandominstituteNumber from '../../services/generateRandominstituteNumber';



class InstituteController {
    static async createInstitute(req:Request, res:Response) {
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

        await sequelize.query(`CREATE TABLE teacher_${instituteNumber} (
            id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
            teacherName VARCHAR(255) NOT NULL,
            teacherEmail VARCHAR(255) NOT NULL UNIQUE,
            teacherPhoneNumber VARCHAR(255) NOT NULL UNIQUE
            )`) 

       res.status(200).json({
            message: "Institute created successfully"
        })

    }
}

export default InstituteController