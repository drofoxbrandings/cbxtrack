import express from "express";
import { saveWebMail, listWebMail, getSingleMail, deleteMail } from '../controller/Webmails.js'
import { validateMails } from '../middleware/Validator.js'
import { auth } from '../middleware/Authentication.js'

const router = express.Router()


router.post('/saveWebMail', auth, validateMails, saveWebMail)
router.get('/listWebMail', auth, listWebMail)
router.get('/getSingleMail/:id', auth, getSingleMail)
router.post('/deleteMail/:id', auth, deleteMail)

export default router;