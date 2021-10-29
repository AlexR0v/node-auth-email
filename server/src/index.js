import dotenv from 'dotenv'
import express from 'express'
import { connectDB } from './config/db.js'
import errorHandler from './middleware/error.js'
import router from './routes/auth.js'
import routerPrivate from './routes/private.js'

dotenv.config({ path: './src/config/config.env' })

const PORT = process.env.PORT ?? 5000

const app = express()

app.use(express.json())
app.use('/api/auth', router)
app.use('/api/private', routerPrivate)

app.use(errorHandler)

const bootstrap = async () => {
  await connectDB()
  const server = app.listen(PORT, () => console.log(`Server run on port:${PORT}`))

  process.on('unhandledRejection', (err) => {
    console.log(`Logged Error: ${err}`)
    server.close(() => process.exit(1))
  })
}

bootstrap()
