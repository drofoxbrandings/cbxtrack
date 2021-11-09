import express from "express";
import {
    login,
    sendPasswordResetLink,
    validateResetLink
} from '../controller/Auth.js'

const router = express.Router()

router.post('/login', login)
router.post('/sendPasswordResetLink', sendPasswordResetLink)
router.post('/validateResetLink', validateResetLink)

export default router;