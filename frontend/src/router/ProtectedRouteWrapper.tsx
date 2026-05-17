import { useEffect, type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { Spinner } from '../components/Spinner'
import { initializeAuthSession } from '../store/authSlice'

interface ProtectedRouteWrapperProps {
  children: ReactNode
}

export default function ProtectedRouteWrapper({ children }: ProtectedRouteWrapperProps) {
  const dispatch = useAppDispatch()
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth)
  const location = useLocation()

  useEffect(() => {
    if (!isAuthenticated) {
      void dispatch(initializeAuthSession())
    }
  }, [dispatch, isAuthenticated])

  if (loading) {
    return <Spinner />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <>{children}</>
}
