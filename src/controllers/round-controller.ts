import { neon } from "@neondatabase/serverless";
import type { Request, Response } from "express";


const sql = neon(process.env.ENVIRONMENT! === 'testing' ? process.env.TEST_DATABASE_URL! : process.env.DEV_DATABASE_URL!)



export const createRound = async(req: Request, res:Response): Promise<Response> => {
    /// Mandatory round info
    const {userId, appId, number} = req.body;


    /// Check if all mandatory info was provided
    if(!req.body.userId) return res.status(400).send("You did not include userId");
    if(!req.body.number) return res.status(400).send("You did not include round number");
    if(!req.body.appId) return res.status(400).send("You did not include appId");


    /// Check if this round already exists within this interview
    const existingRound = await sql`SELECT * FROM rounds WHERE user_id = ${userId} AND application_id = ${appId} AND interview_number = ${number}`

    if(existingRound.length > 0) return res.status(400).send(`This application already has an interview number ${number}`);


    /// Create a round
    try{
        const [round] = await sql.transaction([sql`
            INSERT INTO rounds (user_id, application_id, interview_number)
            VALUES (${userId}, ${appId}, ${number})
            RETURNING *
            `]);

        /// Success message
        return res.status(201).json({message: "Round has been added", round: round})

    /// Error message
    }catch(error){
        console.log("Error has occured during creating a round")
        return res.status(500).json({messae: "Internal message error", error: error})
    }
}