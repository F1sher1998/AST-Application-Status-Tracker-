import { neon } from "@neondatabase/serverless";


export const sql = neon(process.env.ENVIRONMENT! === 'testing' ? process.env.TEST_DATABASE_URL! : process.env.DEV_DATABASE_URL!)