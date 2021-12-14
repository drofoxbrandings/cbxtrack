import express from 'express';
import mongoose from 'mongoose';

import webMailData from '../model/Webmails.js'

export const saveWebMail = async (req, res) => {
    const { uname, phone, email, message } = req.body;
    const newWebMail = new webMailData({ uname, phone, email, message })
    try {
        await newWebMail.save();
        res.status(201).json({ message: "Mail added successfully !!" });
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const listWebMail = async (req, res) => {
    await webMailData.find()
        .then(mails => res.json(mails))
        .catch(err => res.status(400).json('Error:' + err))

}

export const getSingleMail = async (req, res) => {
    await webMailData.findById(req.params.id)
        .then(mails => res.json(mails))
        .catch(err => res.status(400).json('Error:' + err))

}

export const deleteMail = async (req, res) => {
    await webMailData.findByIdAndDelete(req.params.id)
        .then(() => res.json({ message: "Mail deleted successfully" }))
        .catch(err => res.status(400).json('Error:' + err))
}
