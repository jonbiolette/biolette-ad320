import React from 'react'
import { Button } from '@mui/material'
import { Link } from 'react-router-dom'
import { useAuth } from '../Auth/AuthProvider'

function AuthButtons() {
    const { auth } = useAuth()

    if (!auth) {
        return (
            <React.Fragment>
                <Button component={Link} to="/login" color="inherit">
                Login
                </Button>
                <Button component={Link} to="/register" color="inherit">
                Register
                </Button>
            </React.Fragment>
        )
    } else {
        return (
            <Button color="inherit" component={Link} to="/create">
              Add Card
            </Button>
        )
    }
}

export default AuthButtons