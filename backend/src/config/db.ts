import mongoose, { connect } from 'mongoose'
import { env } from './env'

export const connectDatabase = async () => {
  try {
    await connect(env.mongoUri, {
      dbName: 'gigflow',
      retryWrites: true,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    })
    console.log('MongoDB Connected: gigflow')
  } catch (error) {
    console.error('MongoDB connection failed', error)
    throw error
  }
}

export const disconnectDatabase = async () => {
  await mongoose.connection.close()
  console.log('MongoDB connection closed')
}
