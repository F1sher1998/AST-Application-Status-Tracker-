import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { type CookiePayload, type JwtPayload } from './types';
import type { Response } from 'express';


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


export const signCookie = async(res: Response, value: string, name: string, time: number): Promise<any> => {
    return res.cookie(value, name, {maxAge: time, secure:true, httpOnly:true})
};


export const clearCookie = async(res: Response, payload: CookiePayload) => {
    return res.clearCookie(payload.name, {maxAge: payload.exp})
};