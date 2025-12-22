import { neon } from "@neondatabase/serverless";
import type { Request, Response } from "express";
import { applicationSchema } from "../validator";
import type { Application } from "../utils/types";

const sql = neon(process.env.ENVIRONMENT! === 'testing' ? process.env.TEST_DATABASE_URL! : process.env.DEV_DATABASE_URL!)

export const createApplication = async(req: Request, res:Response): Promise<Response> => {
    /// Application mandatory data
    const { error, value } = req.body;

    if(error){
        return res.status(400).json({errors: error.details.map(d => d.message)})
    }

    const body = value as Application

    /// Creating an application
    try{

        /// Creating an application
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

    /// Allowed Search filters
    const AllowedFilters = {
        status: 'status',
        title: 'job_title',
        person: 'reached_person',
        company: 'company',
        date: 'created_at',
        user_id: 'user_id',
        id: 'id'
    }

    /// Parameter of desired applications
    const {filterType, value} = req.params;

    /// Chosen filter type for query
    const chosenFilter = AllowedFilters[filterType]


    /// Check if parameters were provided
    if(!req.params.filterType) return res.status(400).send("You haven't provided a filter");
    if(!req.params.value) return res.status(400).send("You haven't provided a value");    


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

