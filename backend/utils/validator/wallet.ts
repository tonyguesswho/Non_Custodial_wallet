import { body } from 'express-validator';

const myWhitelist: string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890_#@.';

export const validategenerateKeys = [
  body('mnemonic')
    .not().isEmpty()
    .isString()
    .ltrim()
    .rtrim()
    .whitelist(myWhitelist)
    .escape()
    .withMessage('Send your 24 characters long mnemonic words'),

]
