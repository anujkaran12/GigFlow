import dotenv from 'dotenv'

dotenv.config()

export const env = {
  port: process.env.PORT ?? '',
  mongoUri: process.env.MONGODB_URI ?? '',
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET ?? process.env.JWT_SECRET ?? '',
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET ?? process.env.JWT_SECRET ?? '',
  nodeEnv: process.env.NODE_ENV ?? '',
  frontendUrl: process.env.FRONTEND_URL ?? '',
}

export const validateEnv = () => {
  const missingVariables: string[] = []

  if (!env.mongoUri) missingVariables.push('MONGODB_URI')
  if (!env.accessTokenSecret) missingVariables.push('ACCESS_TOKEN_SECRET')
  if (!env.refreshTokenSecret) missingVariables.push('REFRESH_TOKEN_SECRET')
  if (!env.port) missingVariables.push('PORT')
  if (!env.nodeEnv) missingVariables.push('NODE_ENV')
  if (!env.frontendUrl) missingVariables.push('FRONTEND_URL')

  if (missingVariables.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVariables.join(', ')}`)
  }
}
