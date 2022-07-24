import express from 'express';
import mongoose from 'mongoose';

import shipmentStatusData from '../model/shipmentStatus.js'

export const addStatus = async (req, res) => {
    const { shipmentStatus } = req.body;
    const newShipmentStatus = new shipmentStatusData({ shipmentStatus })
    try {
        shipmentStatusData.findOne({ shipmentStatus: shipmentStatus }).then(status => {
            if (status) {
                res.status(200).send("Status already exists!!")
            }
            else {
                try {
                     newShipmentStatus.save();
                    res.status(201).json({ message: "Status added successfully !!" });
                } catch (error) {
                    res.status(409).json({ message: error.message });
                }
            }
        })

    } catch (error) {
        res.status(409).json({ message: error.message });
    }


}

export const listStatus = async (req, res) => {
    await shipmentStatusData.find()
        .then(status => res.status(200).json(status))
        .catch(err => res.status(400).json('Error:' + err))

}


export const deleteStatus = async (req, res) => {
    await shipmentStatusData.findByIdAndDelete(req.params.id)
        .then(() => res.status(200).json({ message: "Status deleted successfully" }))
        .catch(err => res.status(400).json('Error:' + err))
}
