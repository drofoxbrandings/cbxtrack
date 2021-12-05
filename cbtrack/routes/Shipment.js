import express from "express";
import {
    addShipment,
    updateShipment,
    discardShipment,
    activateShipment,
    updateShipmentStatus,
    deleteShipment,
    listShipment
} from '../controller/Shipment.js'
import { validateShipment } from '../middleware/Validator.js'

const router = express.Router()


router.post('/addShipment', validateShipment, addShipment)
router.put('/updateShipment/:id', updateShipment)
router.put('/discardShipment/:id', discardShipment)
router.put('/activateShipment/:id', activateShipment)
router.put('/updateShipmentStatus/:id', updateShipmentStatus)
router.post('/deleteShipment/:id', deleteShipment)
router.get('/listShipment', listShipment)

export default router;