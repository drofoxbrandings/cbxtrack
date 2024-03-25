import express from "express";
import { response } from "express";
import mongoose from "mongoose";
import shipmentData from "../model/Shipment.js";
import statusData from "../model/shipmentStatus.js";

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
  const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let randomString = "";

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters[randomIndex];
  }

  return randomString;
};

export const addShipment = async (req, res) => {
  const refNo = await generateRandomString();
  console.log(req.body);
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
    consigneePostalCode,
    delliverLocation,
    deliveryCity,
    deliveryCountry,
    commodity,
    numberOfPackages,
    shipmentStatus: { shipmentDate, sStatus, statusReason },
    containerNumber,
    expectedDepartureDate,
    expectedArrivalDate,
    carrierName,
    carrierTrackingId,
    carrierLink,
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
    consigneePostalCode,
    delliverLocation,
    deliveryCity,
    deliveryCountry,
    commodity,
    numberOfPackages,
    pickupDate,
    deliveryDate,
    shipmentStatus: { shipmentDate, sStatus, statusReason },
    containerNumber,
    expectedDepartureDate,
    expectedArrivalDate,
    carrierName,
    carrierTrackingId,
    carrierLink,
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
  const { filter, field } = req.query;
  const filterCriteria = {};
  if (filter && field) {
    filterCriteria[field] = { $regex: new RegExp(filter, "i") };
  }
  const query = shipmentData.find(filterCriteria).skip(parseInt(offset));
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
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Invalid reference number",
        });
      } else {
        return res.status(200).json({
          data: result,
        });
      }
    });
};

export const updateShipment = async (req, res) => {
  const currentShipment = req.params.id;
  try {
    const { shipmentDate, sStatus, statusReason } = req.body.shipmentStatus;

    // Fetch status data from the status collection
    const status = await statusData.find({ sStatus: sStatus });
    const isStatus = status.some((item) => item.shipmentStatus === sStatus);
    if (!isStatus) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    // Use the $push operator to add the new shipmentStatus to the array
    const updatedShipment = await shipmentData.findByIdAndUpdate(
      currentShipment,
      {
        $push: {
          shipmentStatus: {
            shipmentDate: shipmentDate,
            sStatus: sStatus,
            statusReason: statusReason,
          },
        },
      },
      { new: true }
    );
    if (!updatedShipment) {
      return res
        .status(404)
        .json({ message: "Data not found in the system!!" });
    }
    res
      .status(200)
      .json({ message: "Shipment information updated successfully!" });
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
  try {
    const { shipmentDate, sStatus } = req.body.shipmentStatus;

    // Fetch status data from the status collection
    const status = await statusData.find({ sStatus: sStatus });
    const isStatus = status.some((item) => item.shipmentStatus === sStatus);
    if (!isStatus) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const shipment = await shipmentData.findByIdAndUpdate(
      thisShipment,
      {
        $push: {
          shipmentStatus: {
            shipmentDate: shipmentDate,
            sStatus: sStatus,
          },
        },
      },
      { new: true } // Return the updated shipment document
    );
    if (!shipment) {
      return res.status(404).json({ message: "Shipment not found !!" });
    }

    res
      .status(200)
      .json({ message: "Shipment status changed successfully !!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
