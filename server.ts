import app  from "./src/app";
import { config } from "dotenv"
config()

import "./src/database/connection"
// database connection
// This code imports the Express application from app.ts and the database connection from connection.ts.


function startServer() {
    const port = process.env.PORT    // Get the port from environment variables
    app.listen(port,function(){
        console.log('Server has started at port ${port}')
    })
}

startServer()