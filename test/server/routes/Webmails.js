import express from "express";
import { saveWebMail, listWebMail, getSingleMail, deleteMail } from '../controller/Webmails.js'
import { validateMails } from '../middleware/Validator.js'

const router = express.Router()


router.post('/saveWebMail', validateMails, saveWebMail)
router.get('/listWebMail', listWebMail)
router.get('/getSingleMail/:id', getSingleMail)
router.post('/deleteMail/:id', deleteMail)

export default router;