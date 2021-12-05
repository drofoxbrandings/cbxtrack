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
        .withMessage('Invalid email'),
    check('phone')
        .escape()
        .not()
        .isEmpty()
        .withMessage('Phone number should not be empty')
        .bail()
        .isMobilePhone(['ar-AE'])
        .withMessage('Invalid mobile number'),
    check('emiratesId')
        .escape()
        .matches(/^784-[0-9]{4}-[0-9]{7}-[0-9]{1,2}$/)
        .withMessage('Invalid emirates Id number'),
    check('role')
        .escape()
        .not()
        .isEmpty()
        .withMessage('Please select the role'),
    check('password')
        .escape()
        .not()
        .isEmpty()
        .withMessage('please enter a password')
        .bail()
        .exists()
        .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
        .withMessage('Password must contain atleast one uppercase letter, one numeric digit and one special character'),
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
        .withMessage('Invalid email'),
    check('phone')
        .escape()
        .not()
        .isEmpty()
        .withMessage('Please enter mobile number!')
        .bail()
        .isMobilePhone(['ar-AE'])
        .withMessage('Invalid mobile number!'),
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
    check('shipperPhone')
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage('Please add shipper phone')
        .bail()
        .isMobilePhone(['ar-AE'])
        .withMessage('Invalid mobile number!'),
    check('shipperLocation')
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage('Please add shipper location')
        .bail()
        .isLength({ min: 3 })
        .withMessage('shipper location is too short'),
    check('shipperCountry')
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage('Please add shipper country'),
    check('consigneeName')
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage('Please add consignee name')
        .bail()
        .exists()
        .isLength({ min: 3 })
        .withMessage('consignee name is too short'),
    check('consigneePhone')
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage('Please add consignee phone number')
        .bail()
        .exists()
        .isLength({ min: 10 })
        .withMessage('invalid phone number'),
    check('consigneePhone')
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage('Please add consignee phone number')
        .bail()
        .exists()
        .isLength({ min: 10 })
        .withMessage('invalid phone number'),
    check('delliverLocation')
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage('Please add delivery location'),
    check('deliveryCity')
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage('Please add delivery city'),
    check('deliveryCountry')
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage('Please add delivery country'),
    check('commodity')
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage('Please add commodity'),
    check('numberOfPackages')
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage('Number of packages should not be empty'),

    function (req, res, next) {
        var errorValidation = validationResult(req);
        if (!errorValidation.isEmpty()) {
            return res.status(400).json({ errorValidation: errorValidation.array() });
        }
        next()
    }
]