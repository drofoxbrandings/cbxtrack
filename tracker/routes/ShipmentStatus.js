import express from "express";
import { addStatus, listStatus, deleteStatus } from '../controller/shipmentStatus.js'
import { validateStatus } from '../middleware/Validator.js'

const router = express.Router()


router.post('/addStatus', validateStatus, addStatus)
router.get('/listStatus', listStatus)
router.post('/deleteStatus/:id', deleteStatus)

export default router;