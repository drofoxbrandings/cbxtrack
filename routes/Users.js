import express from "express";
import { checkEmailExists, checkPhoneExists, checkEidExists, addUser, updateUser, listUser, getSingleUser, deleteUser } from '../controller/Users.js'
import { validateUser } from '../middleware/Validator.js'
import { auth } from '../middleware/Authentication.js'

const router = express.Router()


router.post('/checkEmailExists', auth, checkEmailExists)
router.post('/checkPhoneExists', auth, checkPhoneExists)
router.post('/checkEidExists', auth, checkEidExists)

router.post('/adduser', auth, validateUser, addUser)
router.get('/listUser', auth, listUser)
router.get('/getSingleUser/:id', auth, getSingleUser)
router.put('/updateUser/:id', auth, updateUser)
router.post('/deleteUser/:id', auth, deleteUser)

export default router;