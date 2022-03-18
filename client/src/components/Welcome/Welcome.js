import React from "react"
import { Link } from "react-router-dom"
import {Container, Stack, Button, Typography} from "@mui/material"

const Welcome = () => {
    return (
        <Container maxWidth="md">
            <Stack sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography>Welcome to our app!</Typography>
                <Button component={Link} to="/login">Log in</Button>
                <Button component={Link} to="/register">Register</Button>
            </Stack>
        </Container>
    )
}

export default Welcome