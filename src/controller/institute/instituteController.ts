import { NextFunction, Request, Response } from 'express';
import sequelize from '../../database/connection';
import generateRandominstituteNumber from '../../services/generateRandominstituteNumber';
import { IExtendedRequest } from '../../middleware/type';
import User from '../../database/models/user.model';


class InstituteController {
    // console.log("Triggered InstituteController")
    static async createInstitute(req:IExtendedRequest, res:Response, next : NextFunction) {
        try {
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
       

        //User.findByPk(req.user && req.user.id)

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
            institutePanNo, instituteVatNo] 
         })
        // to create user institute history table where we can see that the user le k kk institute create gareko ho
        await sequelize.query(`CREATE TABLE IF NOT EXISTS user_institute(
            id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
            userId VARCHAR(255) REFERENCES users(id),
            instituteNumber INT UNIQUE
            )`)

          if (req.user){
         await sequelize.query(`INSERT INTO user_institute (userId, instituteNumber) VALUES(?,?)`, {
            replacements: [req.user.id, instituteNumber]
           })  

        //   const user = await User.findByPk(req.user.id)
        //   user?.currentInstituteNumber = instituteNumber
        //   await user?.save()
        
        //alternative way to update the user
        // Update the currentInstituteNumber for the user
          await User.update({
            currentInstituteNumber: instituteNumber,
            role : "institute"
          }, {
            where: {
              id: req.user.id
            }
          })
        }
        req.instituteNumber = instituteNumber; 
        //using raw query
        // await sequelize.query(`UPDATE users SET currentInstituteNumber = '${instituteNumber}' WHERE id = ${req.user?.id}`)

        // req.user?.instituteNumber = instituteNumber;
         next() // call next middleware
        } catch (error) {
          console.log(error)
        }
    }

    static async createTeacherTable(req:IExtendedRequest, res:Response, next : NextFunction) {
     try {
       const instituteNumber = req.instituteNumber
      await sequelize.query(`CREATE TABLE IF NOT EXISTS teacher_${instituteNumber} (
            id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
            teacherName VARCHAR(255) NOT NULL,
            teacherEmail VARCHAR(255) NOT NULL UNIQUE,
            teacherPhoneNumber VARCHAR(255) NOT NULL UNIQUE
            )`)
            next() // call next middleware
     } catch (error) {
      console.log(error)
     }
    }
    
    static async createStudentTable(req:IExtendedRequest, res:Response, next : NextFunction) {
      const instituteNumber = req.instituteNumber
      await sequelize.query(`CREATE TABLE IF NOT EXISTS student_${instituteNumber} (
        id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        studentName VARCHAR(255) NOT NULL,
        studentPhoneNumber VARCHAR(255) NOT NULL UNIQUE
        )`)
      next() 
    }

    static async createCourseTable(req:IExtendedRequest, res:Response, next : NextFunction) {
      const instituteNumber = req.instituteNumber
      await sequelize.query(`CREATE TABLE IF NOT EXISTS course_${instituteNumber} (
        id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        courseName VARCHAR(255) NOT NULL UNIQUE,
        coursePrice DECIMAL(10, 2) NOT NULL
        )`) 

        res.status(200).json({
      message : "Institute created successfully",
      instituteNumber
    })
    }

    
    
}

// const createTeacherTable = async (req: Request, res: Response)=>{
//    await sequelize.query(`CREATE TABLE taecher_${instituteNumber} (
//         id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
//         teacherName VARCHAR(255) NOT NULL,
//         teacherEmail VARCHAR(255) NOT NULL UNIQUE,
//         teacherPhoneNumber VARCHAR(255) NOT NULL UNIQUE
//         )`)
//  

export default InstituteController
