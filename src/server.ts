import express from "express";
import cors from 'cors'
import dotenv from 'dotenv'
import userRouter from "./routes/user-routes"


dotenv.config()
const app = express();


// body parses
app.use(express.json());
app.use(express.urlencoded())

// security
app.use(cors())



//server config

app.use("/users", userRouter)

//connection
app.listen(process.env.PORT, () => {
    console.log(`Server is runnig on PORT ${process.env.PORT}`)
}).on('error', () =>{
    console.log("There was an error")
})
