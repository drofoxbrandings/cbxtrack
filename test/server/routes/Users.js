import express from "express";
import { addUser } from '../controller/Users.js'
import { checkEmailExists, checkPhoneExists, checkEidExists } from '../controller/Users.js'
import { validateUser } from '../middleware/Validator.js'

const router = express.Router()

router.post('/adduser', validateUser, addUser)
router.post('/checkEmailExists', checkEmailExists)
router.post('/checkPhoneExists', checkPhoneExists)
router.post('/checkEidExists', checkEidExists)

export default router;