import type { Request, Response } from "express";
import { roundSchema, noteSchema } from "../validator";
import { type Round } from "../utils/types";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.ENVIRONMENT! === 'testing' ? process.env.TEST_DATABASE_URL! : process.env.DEV_DATABASE_URL!, {fullResults:true})

export const createRound = async(req: Request, res:Response): Promise<Response> => {

    const {error, value} = roundSchema.validate(req.body)
    const { userId, appId } = req.params;

    /// Check for validation error
    if(error){
        return res.status(400).json({errors: error.details.map(d => d.message)})
    }

    /// Assign validated values
    const body = value as Round

    /// Check if this round already exists within this interview
    const existingRound = await sql`SELECT * FROM rounds WHERE user_id = ${userId} AND application_id = ${appId} AND interview_number = ${body.number}`
    if(existingRound.rowCount > 0) return res.status(400).send(`This application already has an interview number ${body.number}`);


    /// Create a round
    try{
        const [round] = await sql.transaction([sql`
            INSERT INTO rounds (user_id, application_id, interview_number, prepare_note, reflection_note)
            VALUES (${body.userId}, ${body.appId}, ${body.number}, ${body.prepare}, ${body.reflect})
            RETURNING *
            `]);

        /// Success message
        return res.status(201).json({
            message: "Round has been added", 
            round: {
                prepare: round.rows[0].prepare_note,
                reflect: round.rows[0].reflection_note,
                number: round.rows[0].interview_number
            }
        });

    /// Error message
    }catch(error){
        console.log("Error has occured during creating a round")
        return res.status(500).json({messae: "Internal message error", error: error})
    }
}


export const addNotes = async(req: Request, res:Response): Promise<Response> =>  {

    /// Request parameters 
    const { userId, appId } = req.params

    /// Validating request body
    const {error, value} = noteSchema.validate(req.body);

    /// Check for validation error
    if(error){
        return res.status(400).json({errors: error.details.map(d => d.message)})
    }

    /// Assign validated values
    const body = value


    /// deconstructing request body
    const keys = Object.keys(body);
    const setClause = keys.map((key) => `${key}`).join(', ');
    const values = Object.values(body)[0];

    /// Adding/Updating notes
    try{
        const [note] = await sql.transaction([sql`
            UPDATE rounds SET ${sql.unsafe(setClause)} = ${values}
            WHERE user_id = ${userId} AND application_id = ${appId}
            RETURNING *
            `]);

        /// Success message
        return res.status(201).json({
            message: "Note was updated", 
            notes: {
                prepare: note.rows[0].prepare_note, 
                reflect: note.rows[0].reflection_note
            }
        })
    
    /// Error message
    }catch(error){
        console.log("Error has occured while updating/adding notes")
        return res.status(500).json({message: "Internal server error", error: error})
    }
}


export const findRounds = async(req: Request, res: Response): Promise<Response> => {
    const { appId } = req.params;

    try{
        const rounds = await sql`
        SELECT * FROM rounds
        WHERE application_id = ${appId}
        ORDER BY interview_number ASC
        `;

        return res.status(200).json({rounds: rounds});
    }catch(error){
        return res.status(500).json({message: "Internal server error", error: error})
    }
}