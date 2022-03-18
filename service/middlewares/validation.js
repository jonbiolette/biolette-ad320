import { validationResult } from 'express-validator'

export const validator = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.sendStatus(400)
    }
    next()
}