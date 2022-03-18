import React, { useState } from "react"
import { List, ListItemButton, ListItemText, ListSubheader, Paper, Stack } from "@mui/material"

import Flashcard from "../Flashcard/Flashcard"

const Deck = ({ deck }) => {
  const [index, setIndex] = useState(0)
  const [isFront, setIsFront] = useState(true)

  const previous = () => {
    if (index > 0) {
      setIndex(index - 1)
    }
  }

  const next = () => {
    if (index < deck.cards.length - 1) {
      setIndex(index + 1)
    }
  }

  const flip = () => {
    setIsFront(!isFront)
  }

  const cardContent = () => {
    if (isFront) {
      return { image: deck.cards[index].frontImage, text: deck.cards[index].frontText }
    } else {
      return { image: deck.cards[index].backImage, text: deck.cards[index].backText }
    }
  }

  if (deck.cards.length < 1) {
    return <span>Add a card!</span>
  } else if (index >= deck.cards.length) {
    setIndex(0)
  } else {
    return (
      <Stack
        direction="row"
        justifyContent="space-around"
        alignItems="flex-start"
        spacing={2}
        sx={{ mt: 3 }}
      >
        <Paper elevation={3}>
          <List
            sx={{ width: "15vw" }}
            subheader={<ListSubheader>Cards</ListSubheader>}
          >
            {deck.cards.map((card, idx) => {
              return (
                <ListItemButton
                  key={idx}
                  selected={idx === index}
                  onClick={() => {
                    setIndex(idx)
                  }}
                >
                  <ListItemText primary={`${card.frontText.slice(0, 15)}...`} />
                </ListItemButton>
              )
            })}
          </List>
        </Paper>
        <Flashcard content={cardContent()} previous={previous} next={next} flip={flip} />
      </Stack>
    )
  }

}
export default Deck
