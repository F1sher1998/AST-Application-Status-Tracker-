import { neon } from "@neondatabase/serverless";
import type{ Request, Response} from 'express'
import dotenv from 'dotenv'
import { signAccessToken, signRefreshToken, hashPassword, comparePasswords} from "../utils/shared";
import { userSchema, logInSchema } from "../validator";
import { type User } from "../utils/types";
import { storeRefreshToken } from "../middleware/auth-middleware";

dotenv.config()

const sql = neon(process.env.ENVIRONMENT! === 'testing' ? process.env.TEST_DATABASE_URL! : process.env.DEV_DATABASE_URL!, {fullResults:true})

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
    if(existingEmail.rows.length > 1){
        return res.status(400).send('User with this email already exists')};
    
    /// Creating a user
    try{

        /// Hashing password
        const hashedPassword = await hashPassword(body.password)

        const [newUser] = await sql.transaction([
            sql`INSERT INTO users (name, email, password_hash)
            VALUES(${body.name}, ${body.email}, ${hashedPassword})
            RETURNING name, id`
        ]);
        
        /// success message
        return res.status(201).json({message: "User has been create", user: 
            {
                name: newUser.rows[0].id, 
                email: newUser.rows[0].email}
            })
    
    /// error message
    }catch(error){
        console.log("The error has occured during user creatin")
        return res.status(500).json({message: "Internal server error", error: error.name})
    }

}





export const logInUser = async(req: Request, res: Response): Promise<Response> => {
    const { error, value } = logInSchema.validate(req.body);

    if(error){
        return res.status(400).json({errors: error.details.map(d => d.message)})
    }

    const body = value as User

    try{

        /// Fetching user from database
        const userResult = await sql`SELECT id, email, password_hash FROM users WHERE email = ${body.email}`
        
        if(userResult.rows.length === 0) {
            return res.status(400).json({message: "Invalid email or password"});
        }

        const user = userResult.rows[0];

        /// Compare provided password with the hashed password
        const verified = await comparePasswords(body.password, user.password_hash)
        if(!verified) return res.status(400).json({message: "Invalid email or password"});

        /// Signing tokens
        const accessToken = await signAccessToken({userId: user.id, email: user.email});
        const refreshToken = await signRefreshToken({userId: user.id, email: user.email});
        
        await storeRefreshToken(user.id, refreshToken);

        /// Setting cookies with proper configuration
        res.cookie("AccessToken", accessToken, {
            maxAge: 15 * 60 * 1000, // 15 minutes
            httpOnly: false, // Allow JS to read it (set true in production)
            secure: false, // Set to true in production with HTTPS
            sameSite: 'lax'
        })
        
        res.cookie("RefreshToken", refreshToken, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            httpOnly: true,
            secure: false, // Set to true in production with HTTPS
            sameSite: 'lax'
        })


        req.user = {id: user.id, email: user.email};


        return res.status(200).json({
            message: "You have logged in successfully", 
            user: {
                id: user.id,
                email: user.email
            }
        });

    }catch(error){
        console.error('Login error:', error);
        return res.status(500).json({message: "Internal server error", error: error})
    }
    
}





export const findAllUsers = async(req: Request, res: Response): Promise<Response> =>{

    /// Searching for users
    try{
        const users = await sql`SELECT name, id FROM users`

        /// Check if there ARE users
        if(!users) return res.status(400).send("There are no users");

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
    const {id} = req.body

    /// Check if ID was provided
    if(!id) return res.status(400).send("You haven't provided user's id");

    /// Search for an existing user
    const existingUser = await sql`SELECT email FROM users WHERE id = ${id}`

    /// Check if user with this ID exists 
    if(!existingUser) return res.status(400).send("User with this id doesnt exists");

    /// Extract existing user
    try{
        const user = await sql`SELECT name, id FROM users WHERE id = ${id}`

        /// Success message
        return res.status(200).json({users: user})

    /// Error message
    }catch(error){
        console.log("Error has occured during finding a user")
        return res.status(500).json({message: "Internal server error", error: error.name})
    }
}





export const getCurrentUser = async(req: Request, res: Response): Promise<Response> => {
    try{
        if(!req.user || !req.user.id){
            return res.status(401).json({ message: "User not authenticated" });
        }

        const user = await sql`
        SELECT id, email, created_at
        FROM users
        WHERE id = ${req.user.id}
        `;

        if(user.rowCount === 0){
            return res.status(404).json({message: "User not found"});
        }

        return res.status(200).json({
            user: user.rows[0]
        })
    }catch (error) {
        console.log("Error getting current user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}