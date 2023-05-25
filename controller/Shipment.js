import express from "express";
import { response } from "express";
import mongoose from "mongoose";
import shipmentData from "../model/Shipment.js";

const createReferenceNumber = async () => {
  let newRefNumber = "";
  const query = shipmentData.find().sort({ shipmentRefNo: -1 }).limit(1);
  const result = await query;
  let lastRefNumber = "cba000";
  if (result.length > 0) {
    lastRefNumber = result[0].shipmentRefNo;
  }

  // Separate the alphabet and number from the last reference number
  const lastAlpha = lastRefNumber.substring(2, 3);
  const lastNum = parseInt(lastRefNumber.substring(3));

  // Generate the new reference number by incrementing the last one
  let newAlpha = lastAlpha;
  let newNum = lastNum + 1;
  if (newNum > 9999) {
    newAlpha = String.fromCharCode(lastAlpha.charCodeAt(0) + 1);
    newNum = 1;
  }
  newRefNumber = "cb" + newAlpha + ("000" + newNum).slice(-4);

  return newRefNumber;
};

const generateRandomString = async () => {
  const characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let randomString = "";

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters[randomIndex];
  }

  return randomString;
};

export const addShipment = async (req, res) => {
  const refNo = await generateRandomString();
  const {
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
    activeFlag,
  } = req.body;

  const pickupDate = new Date(req.body.pickupDate).toString();
  const deliveryDate = new Date(req.body.deliveryDate).toString();

  const newShipment = new shipmentData({
    shipmentRefNo: refNo,
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
    activeFlag,
  });
  try {
    await newShipment.save();
    await newShipment.populate();
    res.status(201).json({ message: "Shipment added successfully !!" });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

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
          res
            .status(201)
            .json({ message: "Shipment status updated successfully !!" });
        } else {
          res
            .status(409)
            .json({ message: "Something went wrong!! Please try again" });
        }
      });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const listShipment = async (req, res) => {
  const limit = req.query.limit || 100;
  const offset = req.query.offset || 0;
  const query = shipmentData.find().skip(parseInt(offset));
  try {
    const result = await query.limit(parseInt(limit));
    const count = await shipmentData.count();
    return res.status(200).json({ data: result, totalRows: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getShipment = async (req, res) => {
  const userId = req.params.id;
  await shipmentData
    .findOne({ shipmentRefNo: req.params.id })
    .then((dbUser) => {
      if (!dbUser) {
        return res.status(401).json({
          message: "Invalid reference number",
        });
      } else {
        return res.status(200).json({
          username: dbUser.shipperName,
          shipmentFrom: dbUser.shipperCountry,
          shipmentTo: dbUser.deliveryCountry,
          shipmentStatus: dbUser.shipmentStatus,
        });
      }
    });
};

export const updateShipment = async (req, res) => {
  const currentShipment = req.params.id;
  try {
    shipmentData
      .findByIdAndUpdate(currentShipment)
      .then((shipment) => {
        if (!shipment) {
          res.status(404).json({ message: "Data not found in system !!" });
        } else {
          shipment.shipmentRefNo = req.body.shipmentRefNo;
          shipment.shipperName = req.body.shipperName;
          shipment.shipperEmail = req.body.shipperEmail;
          shipment.shipperPhone = req.body.shipperPhone;
          shipment.shipperLocation = req.body.shipperLocation;
          shipment.shipperState = req.body.shipperState;
          shipment.shipperCountry = req.body.shipperCountry;
          shipment.consigneeName = req.body.consigneeName;
          shipment.consigneeEmail = req.body.consigneeEmail;
          shipment.consigneePhone = req.body.consigneePhone;
          shipment.delliverLocation = req.body.delliverLocation;
          shipment.deliveryCity = req.body.deliveryCity;
          shipment.deliveryCountry = req.body.deliveryCountry;
          shipment.commodity = req.body.commodity;
          shipment.numberOfPackages = req.body.numberOfPackages;
          shipment.pickupDate = req.body.pickupDate;
          shipment.deliveryDate = req.body.deliveryDate;
          shipment.activeFlag = req.body.activeFlag;
          shipment.shipmentStatus.push({
            shipmentDate: req.body.shipmentStatus.shipmentDate,
            sStatus: req.body.shipmentStatus.sStatus,
          });
          shipment.save();
        }
      })
      .then(() => {
        res
          .status(200)
          .json({ message: "Shipment information updated successfully! " });
      })
      .catch((err) => res.status(409).json({ message: err.message }));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const discardShipment = async (req, res) => {
  const thisShipment = req.params.id;
  await shipmentData
    .findByIdAndUpdate(thisShipment)
    .then((shipment) => {
      if (!shipment) {
        res.status(404).json({ message: "Shipment not found in system !!" });
      } else {
        shipment.activeFlag = false;
        shipment.save();
      }
    })
    .then(() => {
      res.status(200).json({ message: "Shipment discarded successfully !!" });
    })
    .catch((err) => res.status(400).json({ message: err.message }));
};

export const activateShipment = async (req, res) => {
  const thisShipment = req.params.id;
  await shipmentData
    .findByIdAndUpdate(thisShipment)
    .then((shipment) => {
      if (!shipment) {
        res.status(404).json({ message: "Shipment not found in system !!" });
      } else {
        shipment.activeFlag = true;
        shipment.save();
      }
    })
    .then(() => {
      res
        .status(200)
        .json({ message: "Shipment re-activated successfully !!" });
    })
    .catch((err) =>
      res.status(400).json({ status: "400", message: err.message })
    );
};

export const deleteShipment = async (req, res) => {
  try {
    await shipmentData
      .findByIdAndDelete(req.params.id)
      .then((shipment) => {
        if (!shipment) {
          res.status(404).json({ message: "Shipment not found" });
        } else {
          res.status(200).json({ message: "Shipment deleted successfully" });
        }
      })
      .catch((err) => res.status(409).json({ message: err.message }));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateShipmentStatus = async (req, res) => {
  const thisShipment = req.params.id;
  let { shipmentStatus } = req.body;
  try {
    await shipmentData
      .findByIdAndUpdate(thisShipment)
      .then((shipment) => {
        if (!shipment) {
          res.status(404).json({ message: "Shipment not found !!" });
        } else {
          shipment.shipmentStatus.push({
            shipmentDate: req.body.shipmentStatus.shipmentDate,
            sStatus: req.body.shipmentStatus.sStatus,
          });
          shipment.save();
          res
            .status(200)
            .json({ message: "Shipment status changed successfully !!" });
        }
      })
      .catch((err) => res.status(500).json({ message: err.message }));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
