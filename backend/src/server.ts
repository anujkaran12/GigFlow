import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { connectDatabase, disconnectDatabase } from './config/db'
import { env, validateEnv } from './config/env'
import { errorHandler, notFoundHandler } from './middleware/error.middleware'
import routes from './routes'

const app = express()

app.use(cors({ origin: env.frontendUrl, credentials: true }))
app.use(cookieParser())
app.use(express.json())
app.use('/api', routes)
app.use(notFoundHandler)
app.use(errorHandler)

const shutdown = async () => {
  console.log(`Server shutting down gracefully...`)
  await disconnectDatabase()
  process.exit(0)
}


process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

const start = async () => {
  validateEnv()
  await connectDatabase()
  app.listen(Number(env.port), () => {
    console.log(`Server running on port ${env.port}`)
  })
}

start().catch((error) => {
  console.error('Failed to start server:', error)
  process.exit(1)
})