import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'

dotenv.config()

const app = express()
const port = Number(process.env.PORT ?? 3001)

app.use(cors())
app.use(express.json())

export default app

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
