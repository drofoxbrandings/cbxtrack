import express from 'express';
import mongoose from 'mongoose';

import userData from '../model/user.js'

export const addUser = async (req, res) => {
    const { firstName, LastName, email, phone, emiratesId, employeeId, role, password, token, status } = req.body;
    const newUser = new userData({ firstName, LastName, email, phone, emiratesId, employeeId, role, password, token, status })

    try {
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}


export const checkEmailExists = async (req, res) => {
    const { email } = req.body
    try {
        await userData.findOne({ email: email }).then((user_email) => {
            if (user_email) {

                res.status(200).send("The email id is already registered!!")
            }
            else {
                res.status(404).send()
            }
        })
    } catch (error) {
        console.log(error)
    }
}


export const checkPhoneExists = async (req, res) => {
    const { phone } = req.body
    console.log(res)
    try {
        await userData.findOne({ phone: phone }).then((user_phone) => {
            if (user_phone) {

                res.status(200).send("The phone number is already registered!!")
            }
            else {
                res.status(404).send()
            }
        })
    } catch (error) {
        console.log(error)
    }
}
export const checkEidExists = async (req, res) => {
    const { emiratesId } = req.body
    try {
        await userData.findOne({ emiratesId: emiratesId }).then((eid) => {
            if (eid) {
                res.status(200).send("The Emirates id is already registered!!")
            }
            else {
                res.status(404).send()
            }
        })
    } catch (error) {
        console.log(error)
    }
}