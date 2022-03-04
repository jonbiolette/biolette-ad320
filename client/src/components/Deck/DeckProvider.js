import React, { useState } from "react"

import {
    Paper,
    List,
    ListItemButton,
    ListItemText,
    ListSubheader,
    Stack,
} from "@mui/material"

import Deck from '../Deck/Deck'
import CreateFlashcard from '../Flashcard/CreateFlashcard'

const DeckProvider = ({ userId, decks, createMode }) => {
    const [index, setIndex] = useState(0)

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
                    subheader={<ListSubheader>Decks</ListSubheader>}
                >
                    {decks.map((deck, idx) => {
                        return (
                            <ListItemButton
                                key={idx}
                                selected={idx === index}
                                onClick={() => {
                                    setIndex(idx)
                                }}
                            >
                                <ListItemText primary={`${deck.name}`} />
                            </ListItemButton>
                        )
                    })}
                </List>
            </Paper>
            <div>{createMode ? <CreateFlashcard userId={userId} deckId={decks[index]._id} /> : <Deck deck={decks[index]} />}</div>
        </Stack>
    )
}

export default DeckProvider