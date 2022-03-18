import React from 'react'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography
} from '@mui/material'

function Flashcard({ content, previous, next, flip }) {
  return (
    <Box sx={{ width: '100%', mt: 8, display: 'flex', justifyContent: 'space-around'}}>
      <Card sx={{ width: '40vw' }} elevation={3}>
        { content.image && <CardMedia
          component="img"
          height="200"
          image={content.image} />}
        <CardContent>
          <Typography>{content.text ?? ''}</Typography>
        </CardContent>
        <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
            sx={{ mx: 2 }}
            onClick={ () => previous() }
            variant="outlined"
          >
            Prev
          </Button>
          <Button sx={{ mx: 2 }} variant="outlined" onClick={() => flip()}>
            Flip
          </Button>
          <Button
            sx={{ mx: 2 }}
            onClick={ () => next() }
            variant="outlined"
          >
            Next
          </Button>
        </CardActions>
      </Card>
    </Box>
  )
}

export default Flashcard