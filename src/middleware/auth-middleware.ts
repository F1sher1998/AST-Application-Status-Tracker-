/// Auth middleware functions
import { type NextFunction, type Request, type Response } from 'express';
import { signAccessToken, signRefreshToken, verifyToken } from '../utils/shared';
import { sql } from '../db/Neon/neon-client';
import { redisClient } from '../db/Redis/redis-client';


declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

/// Auth middleware itself
export const isAuthenticated = async(req: Request, res: Response, next: NextFunction) => {

    /// Check for access token in cookies
    const accessToken = req.cookies.AccessToken;
    
    if(!accessToken) return refreshTokens(req, res, next);


    try{
        const verified = await verifyToken(accessToken);

        if(!verified) return res.status(401).send("Unauthorized!");

        req.user = verified;

        return next();
    }catch(error){
        return res.status(403).send("Invalid Token");
    }
}


/// Function for storing refresh token in Redis
export const storeRefreshToken = async(userId: string, token: string) => {

    /// Setting a current date value
    const [secondsStr] = await redisClient.time();
    const seconds = Number(secondsStr);
    const dateStr = new Date(seconds * 1000); 
    const date = (dateStr.toISOString().split('T')[0]);

    const existingToken = await redisClient.hGet(`refresh_token:${userId}`, "token") as string
    if(existingToken) return undefined

    /// creating hash
    await redisClient.HSET(`refresh_token:${userId}`, {sub: `${userId}`, iat: `${date}`, token: `${token}`});
    await redisClient.EXPIRE(`refresh_token:${userId}`, 604800);
}



/// Refresh token function
export const refreshTokens = async(req: Request, res: Response, next: NextFunction) => {
    const cookieToken = req.cookies.RefreshToken
    if(!cookieToken) return res.status(401).json({message: "Login again please"})

    const verifiedCookie = await verifyToken(cookieToken)
    if(!verifiedCookie) return res.status(401).json({message: "Unauthorized!"})

    const storedToken = await redisClient.hGet(`refresh_token:${verifiedCookie.id}`, "token") as string
    if(!storedToken) return res.status(401).json({message: "Refresh token is expired within Redis"})

    const payload = await userPayload(verifiedCookie.id)

    const accessToken = await signAccessToken({userId: payload.id, email: payload.email});
    const refreshToken = await signRefreshToken({userId: payload.id, email: payload.email});

    res.cookie("AccessToken", accessToken, {maxAge: 15 * 60 * 1000, httpOnly: false, secure: false, sameSite:"lax"})
    res.cookie("RefreshToken", refreshToken, {maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true, secure: false, sameSite:"lax"})

    await storeRefreshToken(payload.id, refreshToken)

    req.user = {id: payload.id, email: payload.email}
    
    return next()
}

/// Function to extract user payload for JWT
export const userPayload = async(userId:string) => {
    const payload = await sql`SELECT email, id FROM users WHERE id = ${userId}`

    return {email: payload[0].email, id: payload[0].id}
}