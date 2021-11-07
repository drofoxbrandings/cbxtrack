import express from "express";
import {
    login,
    sendResetPasswordLink,
    validateResetLink
} from '../controller/Auth.js'

const router = express.Router()

router.post('/login', login)
router.post('/sendResetPasswordLink', sendResetPasswordLink)
router.post('/validateResetLink', validateResetLink)

export default router;