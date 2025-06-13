import app from "./src/app";
import { config } from "dotenv";
config();

import "./src/database/connection";

function startServer() {
    const port = process.env.PORT || 3000; // fallback
    app.listen(port, () => {
        console.log(`Server has started at port ${port}`);
    });
}

startServer();
