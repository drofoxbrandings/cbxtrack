import express from "express";
import { checkEmailExists, checkPhoneExists, checkEidExists, addUser, updateUser, listUser, getSingleUser, deleteUser } from '../controller/Users.js'
import { validateUser } from '../middleware/Validator.js'

const router = express.Router()


router.post('/checkEmailExists', checkEmailExists)
router.post('/checkPhoneExists', checkPhoneExists)
router.post('/checkEidExists', checkEidExists)

router.post('/adduser', validateUser, addUser)
router.get('/listUser', listUser)
router.get('/getSingleUser/:id', getSingleUser)
router.put('/updateUser/:id', updateUser)
router.post('/deleteUser/:id', deleteUser)

export default router;