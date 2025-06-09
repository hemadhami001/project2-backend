import express from 'express'
const app = express()
import authRoute from "./route/globals/auth/authRoute"

app.use(express.json())


app.use(express.json()) // Middleware to parse JSON bodies

app.use("/api", authRoute)
export default app