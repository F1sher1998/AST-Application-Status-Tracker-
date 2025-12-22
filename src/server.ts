import express from "express";
import cors from 'cors'
import dotenv from 'dotenv'
import userRouter from "./routes/user-routes"
import applicationRouter from "./routes/application-routes"
import roundRouter from './routes/round-routes'
import cookieParser from "cookie-parser";


dotenv.config()
const app = express();


// body parses
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded())

// security
app.use(cors())


//server config
app.use("/users", userRouter)
app.use("/applications", applicationRouter)
app.use("/rounds", roundRouter)


//connection
app.listen(process.env.PORT, () => {
    console.log(`Server is runnig on PORT ${process.env.PORT}`)
}).on('error', () =>{
    console.log("There was an error")
})
