import Joi from 'joi';
import { type User } from './utils/types';

export const userSchema = Joi.object<User>({
    name: Joi.string().alphanum().min(3).max(55).lowercase().required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
});

export const logInSchema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
})

export const applicationSchema = Joi.object({
    userId: Joi.number(),
    title: Joi.string().min(3).required(),
    status: Joi.string().valid('applied', 'rejected', 'interviewing').required(),
    company: Joi.string().min(3).required(),
    date: Joi.date().required(),
    person: Joi.string().min(2),
    lastTouch: Joi.date(),
    offer: Joi.boolean(),
    rejReason: Joi.string().alphanum().min(15)
});



export const roundSchema = Joi.object({
    userId: Joi.number(),
    appId: Joi.number(),
    prepare: Joi.string().allow(null, ''),
    reflect: Joi.string().allow(null, ''),
    number: Joi.number().required()
})


export const noteSchema = Joi.object({
    prepare_note: Joi.string(),
    reflection_note: Joi.string(),
})


export const filterSchema = Joi.object({
    filter: Joi.string().valid('status', 'title', 'person', 'company', 'date', 'user_id', 'id').required()
});
