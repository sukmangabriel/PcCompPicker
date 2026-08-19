import dotenv from 'dotenv'
import { Client } from 'pg'

dotenv.config()

export const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})
