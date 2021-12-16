import express from 'express';
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
        shipmentStatus,
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
        shipmentStatus,
        activeFlag
    })
    try {
        await newShipment.save();
        res.status(201).json({ message: "Shipment added successfully !!" });
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const listShipment = async (req, res) => {
    await shipmentData.find()
        .then(status => res.json(status))
        .catch(err => res.status(400).json('Error:' + err))

}


export const updateShipment = async (req, res) => {
    const currentShipment = req.params.id
    shipmentData.findByIdAndUpdate(currentShipment).then((shipment) => {
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
        shipment.shipmentStatus = req.body.shipmentStatus
        shipment.activeFlag = req.body.activeFlag
        shipment.save()
            .then(() => {
                res.status(200).json({ message: "Shipment information updated successfully! " })
            })
            .catch(err => res.status(400).json('Error:' + err))
    })
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
        .catch(err => res.status(400).json('Error:' + err))
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
        .catch(err => res.status(400).json('Error:' + err))
}

export const deleteShipment = async (req, res) => {
    await shipmentData.findByIdAndDelete(req.params.id)
        .then(() => res.json({ message: "Shipment deleted successfully" }))
        .catch(err => res.status(400).json('Error:' + err))
}


export const updateShipmentStatus = async (req, res) => {
    const thisShipment = req.params.id
    let { shipmentStatus } = req.body
    await shipmentData.findByIdAndUpdate(thisShipment)
        .then((shipment) => {
            shipment.shipmentStatus = shipmentStatus
            shipment.save()
        })
        .then(() => {
            res.status(200).json({ message: "Shipment status changed successfully !!" })
        })
        .catch(err => res.status(400).json('Error:' + err))
}