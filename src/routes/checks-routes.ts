import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { neon } from '@neondatabase/serverless';
import { redisClient } from '../db/Redis/redis-client';

const sql = neon(process.env.ENVIRONMENT! === 'development' ? process.env.DEV_DATABASE_URL! : process.env.PROD_DATABASE_URL!, {fullResults:true}) 

const router = express.Router();



router.get("/health", async(req:Request, res:Response, next:NextFunction) => {
    
    const healthCheck = {
        uptime: process.uptime(),
        message: "ok",
        timestamp: Date.now()
    };

    try{
        res.send(healthCheck)
    }catch(error){
        healthCheck.message = error;
        res.status(503).send()
    }
})



router.get("/ready/neon", async(req:Request, res:Response, next:NextFunction) => {
    const neonCheck = {
        message: "ok",
        timestamp: (await sql`SELECT NOW()`).rows[0]
    };

    try{
        res.send(neonCheck)
    }catch(error){
        neonCheck.message = error;
        res.status(503).send()
    }
});



router.get("/ready/redis", async(req:Request, res:Response, next:NextFunction) => {
    const redisCheck = {
        message: "ok",
        timestamp: await redisClient.TIME()
    };

    try{
        res.send(redisCheck)
    }catch(error){
        redisCheck.message = error;
        res.status(503).send()
    }
})

export default router;