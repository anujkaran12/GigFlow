import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import {
  login,
  logout,
  me,
  refresh,
  register,
} from '../services/auth.service'
import type { ApiErrorResponse, AuthResponse, User } from '../types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterCredentials {
  name: string
  email: string
  password: string
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

export const loginUser = createAsyncThunk<
  AuthResponse,
  LoginCredentials,
  { rejectValue: string }
>('auth/loginUser', async (credentials, { rejectWithValue }) => {
  try {
    return await login(credentials.email, credentials.password)
  } catch (error) {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
      return rejectWithValue(error.response?.data?.message ?? error.message)
    }

    return rejectWithValue(error instanceof Error ? error.message : 'Something went wrong')
  }
})

export const registerUser = createAsyncThunk<
  void,
  RegisterCredentials,
  { rejectValue: string }
>('auth/registerUser', async (credentials, { rejectWithValue }) => {
  try {
    await register(credentials.name, credentials.email, credentials.password)
  } catch (error) {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
      return rejectWithValue(error.response?.data?.message ?? error.message)
    }

    return rejectWithValue(error instanceof Error ? error.message : 'Something went wrong')
  }
})

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logoutUser',
  async (_payload, { rejectWithValue }) => {
    try {
      await logout()
    } catch (error) {
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        return rejectWithValue(error.response?.data?.message ?? error.message)
      }

      return rejectWithValue(error instanceof Error ? error.message : 'Something went wrong')
    }
  },
)

export const fetchCurrentUser = createAsyncThunk<
  AuthResponse,
  void,
  { rejectValue: string }
>('auth/fetchCurrentUser', async (_payload, { rejectWithValue }) => {
  try {
    return await me()
  } catch (error) {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
      return rejectWithValue(error.response?.data?.message ?? error.message)
    }

    return rejectWithValue(error instanceof Error ? error.message : 'Something went wrong')
  }
})

export const initializeAuthSession = createAsyncThunk<
  AuthResponse,
  void,
  { rejectValue: string }
>('auth/initializeAuthSession', async (_payload, { rejectWithValue }) => {
  try {
    await refresh()
    return await me()
  } catch (error) {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
      return rejectWithValue(error.response?.data?.message ?? error.message)
    }

    return rejectWithValue(error instanceof Error ? error.message : 'Something went wrong')
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.isAuthenticated = true
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.user = null
        state.isAuthenticated = false
        state.error = action.payload ?? 'Login failed'
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Registration failed'
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false
        state.user = null
        state.isAuthenticated = false
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false
        state.user = null
        state.isAuthenticated = false
        state.error = action.payload ?? 'Logout failed'
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.isAuthenticated = true
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false
        state.user = null
        state.isAuthenticated = false
      })
      .addCase(initializeAuthSession.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(initializeAuthSession.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.isAuthenticated = true
      })
      .addCase(initializeAuthSession.rejected, (state) => {
        state.loading = false
        state.user = null
        state.isAuthenticated = false
      })
  },
})

export default authSlice.reducer
