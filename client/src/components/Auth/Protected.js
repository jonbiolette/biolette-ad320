import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthProvider'

const Protected = (props) => {
    let { auth } = useAuth()
    let location = useLocation()
    const { children } = props

    if (!auth || !auth.user) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    return children
}

export default Protected