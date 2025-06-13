import {Sequelize} from 'sequelize-typescript';
import { config } from 'dotenv';
config(); // load environment variables from .env file

const sequelize = new Sequelize({
    database : process.env.DB_NAME ,  //database name
    username : process.env.DB_USERNAME ,     // username
    password : process.env.DB_PASSWORD ,  // password
    host : process.env.DB_HOST ,  // host
    dialect : "mysql" , // database dialect
    port : Number(process.env.DB_PORT),  // port number
    models : [__dirname + '/models'], // path to models
})



sequelize.authenticate()
    .then(() => {
        console.log('Authenticated,Database connection has been established successfully.');
    })
    .catch((error) => {
        console.log('Unable to connect to the database:', error);
    })


    // migrate the database + push the models to the database
    sequelize.sync({alter : false}) // set force to true to drop the table if it exists
    .then(() => {
        console.log('migrated data successfully.');
    })

    export default sequelize;
// This code establishes a connection to a MySQL database using Sequelize.