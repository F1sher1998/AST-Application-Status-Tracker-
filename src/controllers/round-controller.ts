import { neon } from "@neondatabase/serverless";
import type { Request, Response } from "express";
import { roundSchema, noteSchema } from "../validator";
import { type Round } from "../utils/types";
import { sql } from "../db/Neon/neon-client";



export const createRound = async(req: Request, res:Response): Promise<Response> => {
    /// Validating request body
    const accessToken = req.cookies.AccessToken
    if(!accessToken) res.status(405).send("You are not authorized!")


    const {error, value} = roundSchema.validate(req.body)

    /// Check for validation error
    if(error){
        return res.status(400).json({errors: error.details.map(d => d.message)})
    }

    /// Assign validated values
    const body = value as Round

    /// Check if this round already exists within this interview
    const existingRound = await sql`SELECT * FROM rounds WHERE user_id = ${body.userId} AND application_id = ${body.appId} AND interview_number = ${body.number}`
    if(existingRound.length > 0) return res.status(400).send(`This application already has an interview number ${body.number}`);


    
    /// Create a round
    try{
        const [round] = await sql.transaction([sql`
            INSERT INTO rounds (user_id, application_id, interview_number, prepare_note, reflection_note)
            VALUES (${body.userId}, ${body.appId}, ${body.number}, ${body.prepare}, ${body.reflect})
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


export const addNotes = async(req: Request, res:Response): Promise<Response> =>  {

    const { userId, appId } = req.params

    const {error, value} = noteSchema.validate(req.body);

    /// Check for validation error
    if(error){
        return res.status(400).json({errors: error.details.map(d => d.message)})
    }

    const body = value

    const keys = Object.keys(body);
    const setClause = keys.map((key) => `${key}`).join(', ');
    const values = Object.values(body)[0];

    console.log(setClause)

    try{
        const [note] = await sql.transaction([sql`
            UPDATE rounds SET ${sql.unsafe(setClause)} = ${values}
            WHERE user_id = ${userId} AND application_id = ${appId}
            RETURNING *
            `]);

        return res.status(201).json({message: "Note was updated", note:  note})
 
    }catch(error){
        console.log("Error has occured while updating/adding notes")
        return res.status(500).json({message: "Internal server error", error: error})
    }
}