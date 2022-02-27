import React from "react"
import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"

function Topbar({ createCardHandler }) {
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
        <Button color="inherit" onClick={createCardHandler}>
          Add Card
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default Topbar
