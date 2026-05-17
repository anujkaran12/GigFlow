import bcrypt from 'bcrypt'
import { User, type UserDocument } from '../models/User'
import type { AuthData, LoginBody, RegisterBody, UserData } from '../types'
import { AppError } from '../utils/AppError'
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt'

interface LoginResult extends AuthData {
  accessToken: string
  refreshToken: string
}

const userToResponse = (user: UserDocument): UserData => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
})



export const registerUser = async ({ name, email, password }: RegisterBody) => {
  const existingUser = await User.findOne({ email })

  if (existingUser) {
    throw new AppError('Email already exists', 400)
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await User.create({
    name,
    email,
    password: hashedPassword,
    role: 'sales',
  })
}

export const loginUser = async ({ email, password }: LoginBody): Promise<LoginResult> => {
  const user = await User.findOne({ email }).select('+password')

  if (!user) {
    throw new AppError('Invalid email or password', 401)
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401)
  }

  const payload = { id: user.id, role: user.role }
  const accessToken = signAccessToken(payload)
  const refreshToken = signRefreshToken(payload)

  return {
    accessToken,
    refreshToken,
    user: userToResponse(user),
  }
}

export const refreshAccessTokenForUser = async (refreshToken: string) => {
  try {
    const decodedToken = verifyRefreshToken(refreshToken)
    const user = await User.findById(decodedToken.id).select('role')

    if (!user) {
      throw  new AppError('Unauthorized', 401)
    }

    return signAccessToken({ id: user.id, role: user.role })
  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }

    throw  new AppError('Unauthorized', 401)
  }
}

export const getCurrentUser = async (userId: string): Promise<AuthData> => {
  try {
    const user = await User.findById(userId).select('name email role')

    if (!user) {
      throw new AppError('User not found', 404)
    }

    return {
      user: userToResponse(user),
    }
  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }

    throw new AppError('Failed to get current user', 500)
  }
}
