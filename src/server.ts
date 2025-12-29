import express from "express";
import cors from 'cors'
import dotenv from 'dotenv'
import userRouter from "./routes/user-routes"
import applicationRouter from "./routes/application-routes"
import roundRouter from './routes/round-routes'
import cookieParser from "cookie-parser";
import { redisClient } from "./db/Redis/redis-client";


dotenv.config()
const app = express();


// body parses
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended:true }))

// security
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:8000',
        'http://localhost:5500',
        'http://127.0.0.1:5500',
        'http://127.0.0.1:8000'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))


//server config
app.use("/users", userRouter)
app.use("/applications", applicationRouter)
app.use("/rounds", roundRouter)


//connection

// Start Redis Client
await redisClient.connect();

// start server
app.listen(process.env.PORT, () => {
    console.log(`Server is runnig on PORT ${process.env.PORT}`)
}).on('error', () =>{
    console.log("There was an error")
})
