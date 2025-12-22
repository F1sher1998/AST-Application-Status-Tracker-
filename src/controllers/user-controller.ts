import { neon } from "@neondatabase/serverless";
import type{ Request, Response} from 'express'
import dotenv from 'dotenv'
import { userSchema } from "../validator";
import { type User } from "../utils/types";
dotenv.config()

/// DB branch selection
const sql = neon(process.env.ENVIRONMENT! === 'testing' ? process.env.TEST_DATABASE_URL! : process.env.DEV_DATABASE_URL!)


/// Creating user controllers

export const createUser = async(req: Request, res: Response): Promise<Response> => {
    /// Receive and validate request body
    const {error, value} = userSchema.validate(req.body);

    /// Check for validation error
    if(error){
        return res.status(400).json({errors: error.details.map(d => d.message)})
    }

    /// Assign validated values
    const body = value as User
    

    /// Checking if the email is already in use
    const existingEmail = await sql`SELECT id FROM users WHERE email = ${body.email}`;
    if(existingEmail.length >= 1){
        return res.status(400).send('User with this email already exists')};///-->> reaplace
    
    /// Creating a user
    try{
        /// Create query
        const [newUser] = await sql.transaction([
            sql`INSERT INTO users (name, email, password_hash)
            VALUES(${body.name}, ${body.email}, ${body.password})
            RETURNING id, created_at`
        ]);
        
        /// success message
        return res.status(201).json({message: "User has been create", user: newUser})///-->> reaplace
    
    /// error message
    }catch(error){
        console.log("The error has occured during user creatin")
        return res.status(500).json({message: "Internal server error", error: error.name})///-->> reaplace
    }

}

export const findAllUsers = async(req: Request, res: Response): Promise<Response> =>{
    /// Searching for users
    try{
        const users = await sql`SELECT name, id FROM users`

        /// Check if there ARE users
        if(users.length < 1) return res.status(400).send("There are no users");

        /// Success message
        return res.status(200).json({users: users})

        /// Error message
    }catch(error){
        console.log("Error has occured during finding all users")
        return res.status(500).json({message: "Internal server error", error: error.name})
    } 
}


export const findUser = async(req: Request, res: Response): Promise<Response> => {
    /// ID of the desired user
    const {id} = req.params;


    /// Check if ID was provided
    if(!req.params.id) return res.status(400).send("You haven't provided user's id");

    /// Search for an existing user
    const existingUser = await sql`SELECT email FROM users WHERE id = ${parseInt(id)}`

    /// Check if user with this ID exists 
    if(existingUser.length <= 0) return res.status(400).send("User with this id doesnt exists");

    /// Extract existing user
    try{
        const [user] = await sql`SELECT name, id FROM users WHERE id = ${id}`

        /// Success message
        return res.status(200).json({users: user})

    /// Error message
    }catch(error){
        console.log("Error has occured during finding a user")
        return res.status(500).json({message: "Internal server error", error: error.name})
    }
}

