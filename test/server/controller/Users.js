import express from 'express';
import mongoose from 'mongoose';

import userData from '../model/user.js'
import { body, validationResult } from 'express-validator'

export const addUser = async (req, res) => {
    const { firstName, LastName, email, phone, emiratesId, employeeId, role, password, token, status } = req.body;
    const newUser = new userData({ firstName, LastName, email, phone, emiratesId, employeeId, role, password, token, status })
    let messages = [{
        firstName: "",
        LastName: "",
        email: "",
        phone: "",
        emiratesId: "",
        employeeId: "",
        role: "",
        password: "",
        token: "",
        status: "",
    }]
    try {
        if (firstName === "" || firstName === null) {
            messages.push()
        } else {

        }
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}


export const checkEmailExists = async (req, res) => {
    const { email } = req.body
    let messages = [];
    try {
        await userData.findOne({ email: email }).then(user => {
            if (user.email === email) {
                messages.push("The email you have entered is already registered. Please login or use another email to register.")
                res.send(messages)
            }
        })
    } catch (error) {
        console.log(error.message)
    }
}
export const checkPhoneExists = async (req, res) => {
    const { phone } = req.body
    let messages = [];
    try {
        await userData.findOne({ phone: phone }).then(user => {
            if (user.phone === phone) {
                messages.push("The mobile number you have entered is already registered.")
                res.send(messages)
            }
        })
    } catch (error) {
        console.log(error.message)
    }
}
export const checkEidExists = async (req, res) => {
    const { emiratesId } = req.body
    let messages = [];
    try {
        await userData.findOne({ emiratesId: emiratesId }).then(user => {
            if (user.emiratesId === emiratesId) {
                messages.push("The emirates id number you have entered is already registered.")
                res.send(messages)
            }
        })
    } catch (error) {
        console.log(error.message)
    }
}