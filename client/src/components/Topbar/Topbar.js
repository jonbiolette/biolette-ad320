import React from "react"
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import AuthButtons from "./AuthButtons"

function Topbar() {
  return (
    <AppBar position="static">
      <Toolbar variant="dense">
        <IconButton
          edge="start"
          color="inherit"
          aria-label="home-icon"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1 }}>
          Notoriety
        </Typography>
        <AuthButtons />
      </Toolbar>
    </AppBar>
  )
}

export default Topbar
