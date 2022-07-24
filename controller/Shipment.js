import express from 'express';
import { response } from 'express';
import mongoose from 'mongoose';
import shipmentData from '../model/Shipment.js'

export const addShipment = async (req, res) => {
    const {
        shipmentRefNo,
        shipperName,
        shipperEmail,
        shipperPhone,
        shipperLocation,
        shipperState,
        shipperCountry,
        consigneeName,
        consigneeEmail,
        consigneePhone,
        delliverLocation,
        deliveryCity,
        deliveryCountry,
        commodity,
        numberOfPackages,
        shipmentStatus: { shipmentDate, sStatus },
        activeFlag
    } = req.body;

    const pickupDate = new Date(req.body.pickupDate).toString();
    const deliveryDate = new Date(req.body.deliveryDate).toString();

    const newShipment = new shipmentData({
        shipmentRefNo,
        shipperName,
        shipperEmail,
        shipperPhone,
        shipperLocation,
        shipperState,
        shipperCountry,
        consigneeName,
        consigneeEmail,
        consigneePhone,
        delliverLocation,
        deliveryCity,
        deliveryCountry,
        commodity,
        numberOfPackages,
        pickupDate,
        deliveryDate,
        shipmentStatus: { shipmentDate, sStatus },
        activeFlag
    })
    try {
        await newShipment.save();
        await newShipment.populate()
        res.status(201).json({ message: "Shipment added successfully !!" });
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const addStatus = async (req, res) => {
    try {
        await shipmentData
            .findOneAndUpdate(
                {
                    _id: req.params.id,
                },
                {
                    $push: req.body,
                },
                { new: true }
            )
            .then((result) => {
                if (result) {
                    res.status(201).json({ message: "Shipment status updated successfully !!" });
                }
                else {
                    res.status(409).json({ message: "Something went wrong!! Please try again" })
                }
            });
    } catch (error) {
        res.status(409).json({ message: error.message })
    }
}

export const listShipment = async (req, res) => {
    const limit = req.params.limit
    const offset = req.params.offset
    try {
        await shipmentData.find().skip(offset).limit(limit)
            .then(shipment => res.status(200).json({ data: shipment, totalRows: shipment.length }))
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

}

export const getShipment = async (req, res) => {
    const userId = req.params.id
    await shipmentData.findOne({ shipmentRefNo: req.params.id })
        .then(
            dbUser => {
                if (!dbUser) {
                    return res.status(401).json({
                        message: "Invalid reference number"
                    })
                }
                else {
                    return res.status(200).json({
                        username: dbUser.shipperName,
                        shipmentFrom: dbUser.shipperCountry,
                        shipmentTo: dbUser.deliveryCountry,
                        shipmentStatus: dbUser.shipmentStatus
                    })
                }
            }
        )
}


export const updateShipment = async (req, res) => {
    const currentShipment = req.params.id
    try {

        shipmentData.findByIdAndUpdate(currentShipment).then((shipment) => {
            if (!shipment) {
                res.status(404).json({ message: "Data not found in system !!" })
            }
            else {
                shipment.shipmentRefNo = req.body.shipmentRefNo
                shipment.shipperName = req.body.shipperName
                shipment.shipperEmail = req.body.shipperEmail
                shipment.shipperPhone = req.body.shipperPhone
                shipment.shipperLocation = req.body.shipperLocation
                shipment.shipperState = req.body.shipperState
                shipment.shipperCountry = req.body.shipperCountry
                shipment.consigneeName = req.body.consigneeName
                shipment.consigneeEmail = req.body.consigneeEmail
                shipment.consigneePhone = req.body.consigneePhone
                shipment.delliverLocation = req.body.delliverLocation
                shipment.deliveryCity = req.body.deliveryCity
                shipment.deliveryCountry = req.body.deliveryCountry
                shipment.commodity = req.body.commodity
                shipment.numberOfPackages = req.body.numberOfPackages
                shipment.pickupDate = req.body.pickupDate
                shipment.deliveryDate = req.body.deliveryDate
                shipment.activeFlag = req.body.activeFlag
                shipment.shipmentStatus.push({
                    shipmentDate: req.body.shipmentStatus.shipmentDate,
                    sStatus: req.body.shipmentStatus.sStatus
                })
                shipment.save()
            }
        })
            .then(() => {
                res.status(200).json({ message: "Shipment information updated successfully! " })
            })
            .catch(err => res.status(409).json({ message: err.message }))

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const discardShipment = async (req, res) => {
    const thisShipment = req.params.id
    await shipmentData.findByIdAndUpdate(thisShipment)
        .then((shipment) => {
            shipment.activeFlag = false
            shipment.save()
        })
        .then(() => {
            res.status(200).json({ message: "Shipment discarded successfully !!" })
        })
        .catch(err => res.status(400).json({ message: err.message }))
}

export const activateShipment = async (req, res) => {
    const thisShipment = req.params.id
    await shipmentData.findByIdAndUpdate(thisShipment)
        .then((shipment) => {
            shipment.activeFlag = true
            shipment.save()
        })
        .then(() => {
            res.status(200).json({ message: "Shipment re-activated successfully !!" })
        })
        .catch(err => res.status(400).json({ status: '400', message: err.message }))
}

export const deleteShipment = async (req, res) => {

    try {
        await shipmentData.findByIdAndDelete(req.params.id)
            .then((shipment) => {
                if (!shipment) {
                    res.status(404).json({ message: "Shipment not found" })
                }
                else {
                    res.status(200).json({ message: "Shipment deleted successfully" })
                }
            })
            .catch(err => res.status(409).json({ message: err.message }))
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

}

export const updateShipmentStatus = async (req, res) => {
    const thisShipment = req.params.id
    let { shipmentStatus } = req.body
    try {
        await shipmentData.findByIdAndUpdate(thisShipment)
            .then((shipment) => {
                if (!shipment) {
                    res.status(404).json({ message: "Shipment not found !!" })
                }
                else {
                    shipment.shipmentStatus.push({
                        shipmentDate: req.body.shipmentStatus.shipmentDate,
                        sStatus: req.body.shipmentStatus.sStatus
                    })
                    shipment.save()
                    res.status(200).json({ message: "Shipment status changed successfully !!" })
                }
            })
            .catch(err => res.status(500).json({ message: err.message }))
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}