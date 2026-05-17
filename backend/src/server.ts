import cors from 'cors'
import cookieParser from 'cookie-parser'
import express from 'express'
import type { Server } from 'node:http'
import { connectDatabase, disconnectDatabase } from './config/db'
import { env, validateEnv } from './config/env'
import { errorHandler, notFoundHandler } from './middleware/error.middleware'
import routes from './routes'

const app = express()

app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  }),
)
app.use(cookieParser())
app.use(express.json())

app.use('/api', routes)
app.use(notFoundHandler)
app.use(errorHandler)

let server: Server | undefined

const gracefulShutdown = (signal: NodeJS.Signals) => {
  console.log(`${signal} received. Gracefully server shutting down...`)

  if (!server) {
    void disconnectDatabase().finally(() => process.exit(0))
    return
  }

  server.close(() => {
    void disconnectDatabase()
      .then(() => {
        console.log('Server shut down gracefully')
        process.exit(0)
      })
      .catch((error: unknown) => {
        console.error('Error during graceful shutdown', error)
        process.exit(1)
      })
  })
}

const startServer = async () => {
  try {
    validateEnv()
    await connectDatabase()

    server = app.listen(Number(env.port), () => {
      console.log(`Server running on port ${env.port}`)
    })
  } catch (error) {
    console.error('Server failed to start because database connection was not established', error)
    process.exit(1)
  }
}

process.on('SIGINT', gracefulShutdown)
process.on('SIGTERM', gracefulShutdown)

startServer()
