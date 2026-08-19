import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { client } from './db.js'
import authRoutes from './routes/auth.js'

dotenv.config()

const app = express()
const port = Number(process.env.PORT ?? 3001)

app.use(cors())
app.use(express.json())
app.use('/api', authRoutes)

async function startServer() {
  try {
    await client.connect()
    console.log('Povezani ste na bazu podataka.')

    app.listen(port, () => {
      console.log(`Server radi na http://localhost:${port}`)
    })
  } catch (error) {
    console.error('Neuspjela konekcija s bazom:', error)
    process.exit(1)
  }
}

startServer()

export default app
