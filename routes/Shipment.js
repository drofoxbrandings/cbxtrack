import express from "express";
import {
    addShipment,
    updateShipment,
    discardShipment,
    activateShipment,
    deleteShipment,
    listShipment,
    addStatus,
    getShipment,
    updateShipmentStatus
} from '../controller/Shipment.js'
import { validateShipment } from '../middleware/Validator.js'
import { auth } from '../middleware/Authentication.js'

const router = express.Router()


router.post('/addShipment', auth, validateShipment, addShipment)
router.put('/updateShipment/:id', auth, validateShipment, updateShipment)
router.put('/discardShipment/:id', auth, discardShipment)
router.put('/activateShipment/:id', auth, activateShipment)
router.put('/addStatus/:id', auth, addStatus)
router.post('/deleteShipment/:id', auth, deleteShipment)
router.get('/listShipment', auth, listShipment)
router.get('/getShipment/:id', auth, getShipment)
router.put('/updateShipmentStatus/:id', auth, updateShipmentStatus)

export default router;