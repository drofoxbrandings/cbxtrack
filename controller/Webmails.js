import express from "express";
import mongoose from "mongoose";

import webMailData from "../model/Webmails.js";

export const saveWebMail = async (req, res) => {
  const { uname, phone, email, message, readReciept } = req.body;
  const newWebMail = new webMailData({ uname, phone, email, message, readReciept });
  try {
    await newWebMail.save();
    res.status(201).json({ message: "Mail added successfully !!" });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const listWebMail = async (req, res) => {
  const limit = req.query.limit || 100;
  const offset = req.query.offset || 0;
  const { filter, field } = req.query;
  const filterCriteria = {};
  if (filter && field) {
    filterCriteria[field] = { $regex: new RegExp(filter, "i") };
  }
  const query = webMailData.find(filterCriteria).skip(parseInt(offset));
  try {
    const result = await query.limit(parseInt(limit));
    const count = await webMailData.count();
    return res.status(200).json({ data: result, totalRows: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSingleMail = async (req, res) => {
  await webMailData
    .findById(req.params.id)
    .then((mails) => res.status(200).json(mails))
    .catch((err) => res.status(400).json("Error:" + err));
};

export const deleteMail = async (req, res) => {
  await webMailData
    .findByIdAndDelete(req.params.id)
    .then(() => res.status(204).json({ message: "Mail deleted successfully" }))
    .catch((err) => res.status(400).json("Error:" + err));
};
