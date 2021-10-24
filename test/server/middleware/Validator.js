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