import type { Request, Response } from "express";
import { applicationSchema } from "../validator";
import { type Application, AllowedFilters } from "../utils/types";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.ENVIRONMENT! === 'testing' ? process.env.TEST_DATABASE_URL! : process.env.DEV_DATABASE_URL!, {fullResults:true})

export const createApplication = async(req: Request, res:Response): Promise<Response> => {

    /// Application mandatory data
    const { error, value } = applicationSchema.validate(req.body);
    const userId = req.user!.id

    if(error){
        return res.status(400).json({errors: error.details.map(d => d.message)})
    }

    /// Assign validated values
    const body = value as Application

    /// Creating an application
    try{
        const [application] = await sql.transaction([sql`
                INSERT INTO applications (user_id, job_title, status, company, application_date)
                VALUES (${userId}, ${body.title}, ${body.status}, ${body.company}, ${body.date})
                RETURNING job_title, status, company, application_date
            `]);

        /// Success message
        return res.status(201).json({
            message: "Application has been created", 
            application: {
                title: application.rows[0].job_title,
                status: application.rows[0].status,
                company: application.rows[0].company,
                date: application.rows[0].application_date
            }
        });

    /// Error message
    }catch(error){
        console.log("Error has occured during creation of an application", error)
        return res.status(500).json({message: "Internal server error", error: error})
    }
}

export const findAllApplications = async(req: Request, res:Response): Promise<Response> => {
    const userId = req.user!.id

    /// Finding applications
    try{

        /// Extracting applications
        const applications = await sql`SELECT id, job_title, status, application_date, company FROM applications WHERE user_id = ${userId}`
        
        /// Check If no applications found
        if(applications.rowCount < 1) return res.status(200).json({applications: []});

        /// Success message
        return res.status(200).json({applications: applications.rows});
    /// Error message
    }catch(error){
        console.log("Error has occured during finding all applications")
        return res.status(500).json({message: "Internal server error", error: error})
    }
}

export const FilterApplications = async(req: Request, res:Response): Promise<Response> => {

    const userId = req.user!.id

    const { columnName, value } = req.body;
    if(!req.body) return res.status(400).json({message: "You havent entered necessary fields"});

    const allowedColumns = ['status', 'application_date', 'job_title', 'company']
    if(!allowedColumns.includes(columnName)) return res.status(400).json({message: "Invalid column"})

    try{
        const result = await sql`SELECT * FROM applications WHERE ${sql(columnName)} = ${value} AND user_id = ${userId}`
        //const result = await sql`SELECT * FROM format('SELECT * FROM applications WHERE %I = $L', ${columnName}, ${value})`
        return res.status(200).json({ applications: result.rows });
    }catch(error){
        return res.status(500).json({message: "Internal server error"})
    }
}

export const updateApplicationStatus = async(req: Request, res:Response): Promise<Response> => {
    
    const userId = req.user!.id
    const { appId } = req.params;
    const { status } = req.body;

    /// Check if status is provided
    if(!status) return res.status(400).send("You haven't provided a status");
    
    /// Update application status
    try{
        const [updatedApplication] = await sql.transaction([sql`
            UPDATE applications
            SET status = ${status}
            WHERE id = ${appId} AND user_id = ${userId}
            RETURNING id, job_title, status
        `]);

        /// Success message
        return res.status(200).json({message: "Application status has been updated", application: {
            id: updatedApplication.rows[0].id,
            title: updatedApplication.rows[0].job_title,
            status: updatedApplication.rows[0].status
        }})

    /// Error message
    }catch(error){
        console.log("Error has occured during updating application status")
        return res.status(500).json({message: "Internal server error", error: error});
    }    
}