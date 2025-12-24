import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcrypt';
import { type CookiePayload, type JwtPayload } from './types';
import type { Response } from 'express';



/// JWT functions
const AcessExpiry = "15m"

export const signAccessToken = async(payload: JwtPayload): Promise<string> => {
    return jwt.sign({id: payload.userId, email: payload.email}, process.env.JWT_SECRET!, {expiresIn: '15m'})};


export const signRefreshToken = async(payload: JwtPayload): Promise<string> => {
    return jwt.sign({id: payload.userId, email: payload.email}, process.env.JWT_SECRET!, {expiresIn: '15m'})};


export const verifyToken = async(token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!) as {
    id: string
    email: string
  }
};


/// Cookie functions
export const signCookie = async(res: Response, value: string, name: string, time: number): Promise<any> => {
    return res.cookie(value, name, {maxAge: time, secure:true, httpOnly:true})
};


export const clearCookie = async(res: Response, payload: CookiePayload) => {
    return res.clearCookie(payload.name, {maxAge: payload.exp})
};



/// Password hashing functions
export const hashPassword = async(password: string): Promise<string> => {
  const hashed = await bcrypt.hash(password, 10)
  return hashed;
}


export const comparePasswords = async(password: string, hashed: string): Promise<boolean> => {
  const compared = await bcrypt.compare(password, hashed)
  return compared;
}