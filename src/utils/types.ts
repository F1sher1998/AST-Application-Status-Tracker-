export interface JwtPayload{
    userId: string,
    email: string,
    iat?: string,
    exp?: string | number
}

export interface CookiePayload{
    value: string,
    name: string,
    exp: number
}

export interface Token{
    token: string
}

export interface User{
    name: string,
    email: string,
    password: string
}


export interface Application{
    userId: string
    title: string,
    status: string,
    company: string,
    date: string,
    person?: string,
    lastTouch?: string,
    offer?: boolean
    rejReason?: string
}


export interface Round{
    userId: number,
    appId: number,
    prepare?: string | null,
    reflect?: string | null,
    number: number
}