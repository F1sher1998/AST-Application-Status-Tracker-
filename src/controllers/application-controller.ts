import type { Request, Response } from "express";
import { applicationSchema } from "../validator";
import { type Application, AllowedFilters } from "../utils/types";
import { sql } from "../db/Neon/neon-client";

export const createApplication = async(req: Request, res:Response): Promise<Response> => {


    /// Application mandatory data
    const { error, value } = applicationSchema.validate(req.body);
    if(error){
        return res.status(400).json({errors: error.details.map(d => d.message)})
    }

    /// Assign validated values
    const body = value as Application

    /// Creating an application
    try{
        const [application] = await sql.transaction([sql`
                INSERT INTO applications (user_id, job_title, status, company, application_date, reached_person)
                VALUES (${body.userId}, ${body.title}, ${body.status}, ${body.company}, ${body.date}, ${body.person})
                RETURNING job_title, status, company, application_date
            `]);

        /// Success message
        return res.status(201).json({message: "Application has been created", application: application})

    /// Error message
    }catch(error){
        console.log("Error has occured during creation of an application")
        return res.status(500).json({message: "Internal server error", error: error})
    }
}

export const findAllApplications = async(req: Request, res:Response): Promise<Response> => {


    /// Finding applications
    try{

        /// Extracting applications
        const applications = await sql`SELECT id, job_title, status, application_date FROM applications`
        
        /// Check If no applications found
        if(applications.length < 1) return res.status(400).send("There are no applications");

        /// Success message
        return res.status(200).json({applications: applications})

    /// Error message
    }catch(error){
        console.log("Error has occured during finding all applications")
        return res.status(500).json({message: "Internal server error", error: error})
    }
}

export const FilterApplications = async(req: Request, res:Response): Promise<Response> => {

    /// Allowed filters
    const filters = AllowedFilters;

    /// Parameter of desired applications
    const {filterType, value} = req.params;

    /// Check if filter type is valid
    if(!(filterType in filters)){
        return res.status(400).send("You have provided an invalid filter type")
    }

    /// Chosen filter type for query
    const chosenFilter = filterType as keyof typeof filters;
    

    /// Search for an existing applications
    try{
        const filteredApplications = await sql`
        SELECT id, job_title, application_date
        FROM applications
        WHERE ${sql.unsafe(chosenFilter)} = ${value}`;


        /// Check if any application were found
        if(filteredApplications.length < 1) return res.status(400).send("No items were found");

        /// Success message
        return res.status(200).json({applications: filteredApplications})

    /// Error message
    }catch(error){
        console.log("Error has occured during filtering applications!")
        return res.status(500).json({message: "Internal server error", error: error});
    } 
    
}

export const updateApplicationStatus = async(req: Request, res:Response): Promise<Response> => {
    
    const { appId } = req.params;
    const { status } = req.body;

    /// Check if status is provided
    if(!status) return res.status(400).send("You haven't provided a status");
    
    /// Update application status
    try{
        const updatedApplication = await sql.transaction([sql`
            UPDATE applications
            SET status = ${status}
            WHERE id = ${appId}
            RETURNING id, job_title, status
        `]);

        /// Success message
        return res.status(200).json({message: "Application status has been updated", application: updatedApplication})

    /// Error message
    }catch(error){
        console.log("Error has occured during updating application status")
        return res.status(500).json({message: "Internal server error", error: error});
    }    
}