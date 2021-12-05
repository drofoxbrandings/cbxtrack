import express from "express";
import {
    login,
    sendPasswordResetLink,
    resetPassword,
    changePassword
} from '../controller/Auth.js'

const router = express.Router()

router.post('/login', login)
router.post('/sendPasswordResetLink', sendPasswordResetLink)
router.post('/resetPassword', resetPassword)
router.post('/changePassword', changePassword)

export default router;