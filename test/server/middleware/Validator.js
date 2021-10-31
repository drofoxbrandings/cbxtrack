import { check, validationResult } from 'express-validator'

export const validateUser = [
    check('firstName')
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage('First name should not be empty!')
        .bail()
        .exists()
        .isLength({ min: 3 })
        .withMessage('First name is too short'),
    check('email')
        .trim()
        .normalizeEmail()
        .not()
        .isEmpty()
        .withMessage('Email should not be empty')
        .bail()
        .isEmail()
        .withMessage('Invalid email')
        .bail(),
    check('phone')
        .escape()
        .not()
        .isEmpty()
        .withMessage('Phone number should not be empty')
        .isMobilePhone(['ar-AE'])
        .withMessage('Invalid mobile number')
        .bail(),
    check('emiratesId')
        .escape()
        .matches(/^784-[0-9]{4}-[0-9]{7}-[0-9]{1,2}$/)
        .withMessage('Invalid emirates Id number'),
    check('role')
        .escape()
        .not()
        .isEmpty()
        .withMessage('Please select the role'),
    function (req, res, next) {

        var errorValidation = validationResult(req);
        if (!errorValidation.isEmpty()) {
            return res.status(400).json({ errorValidation: errorValidation.array() });
        }
        next()
    }
]


export const validateMails = [
    check('uname')
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage('Name should not be empty!')
        .bail()
        .exists()
        .isLength({ min: 3 })
        .withMessage('Name is too short'),
    check('email')
        .trim()
        .normalizeEmail()
        .not()
        .isEmpty()
        .withMessage('Please enter email id!')
        .bail()
        .isEmail()
        .withMessage('Invalid email')
        .bail(),
    check('phone')
        .escape()
        .not()
        .isEmpty()
        .withMessage('Please enter phone number!')
        .isMobilePhone(['ar-AE'])
        .withMessage('Invalid mobile number!')
        .bail(),
    check('message')
        .escape()
        .not()
        .isEmpty()
        .withMessage('Please add your message!'),
    function (req, res, next) {
        var errorValidation = validationResult(req);
        if (!errorValidation.isEmpty()) {
            return res.status(400).json({ errorValidation: errorValidation.array() });
        }
        next()
    }
]


export const validateStatus = [
    check('shipmentStatus')
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage('Please add a status')
        .bail()
        .exists()
        .isLength({ min: 3 })
        .withMessage('Status is too short'),
    function (req, res, next) {
        var errorValidation = validationResult(req);
        if (!errorValidation.isEmpty()) {
            return res.status(400).json({ errorValidation: errorValidation.array() });
        }
        next()
    }
]

export const validateShipment = [
    check('shipperName')
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage('Please add shipper name')
        .bail()
        .exists()
        .isLength({ min: 3 })
        .withMessage('shipper name is too short'),
    function (req, res, next) {
        var errorValidation = validationResult(req);
        if (!errorValidation.isEmpty()) {
            return res.status(400).json({ errorValidation: errorValidation.array() });
        }
        next()
    }
]