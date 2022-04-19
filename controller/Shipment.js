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
        res.json({ status: '201', message: "Shipment added successfully !!" });
    } catch (error) {
        res.json({ status: '409', message: error.message });
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
                    res.json({ status: '201', message: "Shipment status updated successfully !!" });
                }
                else {
                    res.json({ status: '409', message: "Something went wrong!! Please try again" })
                }
            });
    } catch (error) {
        res.json({ status: '409', message: error.message })
    }
}

export const listShipment = async (req, res) => {
    const limit = req.params.limit
    const offset= req.params.offset
    try {
        await shipmentData.find().skip(offset).limit(limit)
            .then(shipment => res.json({ status: '200', data: shipment, totalRows: shipment.length }))
    } catch (error) {
        res.json({ message: error.message })
    }

}

export const getShipment = async (req, res) => {
    const userId = req.params.id
    await shipmentData.findOne({ shipmentRefNo: req.params.id })
        .then(
            dbUser => {
                if (!dbUser) {
                    return res.json({
                        message: "Invalid reference number"
                    })
                }
                else {
                    return res.json({
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
                res.json({ status: "404", message: "Data not found in system !!" })
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
                res.json({ status: '200', message: "Shipment information updated successfully! " })
            })
            .catch(err => res.json({ message: err.message }))

    } catch (error) {
        res.json({ message: error.message })
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
            res.json({ status: '200', message: "Shipment discarded successfully !!" })
        })
        .catch(err => res.json({ status: '400', message: err.message }))
}

export const activateShipment = async (req, res) => {
    const thisShipment = req.params.id
    await shipmentData.findByIdAndUpdate(thisShipment)
        .then((shipment) => {
            shipment.activeFlag = true
            shipment.save()
        })
        .then(() => {
            res.json({ status: '200', message: "Shipment re-activated successfully !!" })
        })
        .catch(err => res.json({ status: '400', message: err.message }))
}

export const deleteShipment = async (req, res) => {

    try {
        await shipmentData.findByIdAndDelete(req.params.id)
            .then((shipment) => {
                if (!shipment) {
                    res.json({ status: "404", message: "Shipment not found" })
                }
                else {
                    res.json({ status: "200", message: "Shipment deleted successfully" })
                }
            })
            .catch(err => res.json({ status: '500', message: err.message }))
    } catch (error) {
        res.json({ message: error.message })
    }

}

export const updateShipmentStatus = async (req, res) => {
    const thisShipment = req.params.id
    let { shipmentStatus } = req.body
    try {
        await shipmentData.findByIdAndUpdate(thisShipment)
            .then((shipment) => {
                if (!shipment) {
                    res.json({ status: "404", message: "Shipment not found !!" })
                }
                else {
                    shipment.shipmentStatus.push({
                        shipmentDate: req.body.shipmentStatus.shipmentDate,
                        sStatus: req.body.shipmentStatus.sStatus
                    })
                    shipment.save()
                    res.json({ status: '200', message: "Shipment status changed successfully !!" })
                }
            })
            .catch(err => res.json({ status: '500', message: err.message }))
    } catch (error) {
        res.json({ message: error.message })
    }
}