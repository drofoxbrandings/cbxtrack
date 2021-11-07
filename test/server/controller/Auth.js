import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

import userData from '../model/user.js'
import PasswordResetData from '../model/PasswordReset.js'
import nodemailer from 'nodemailer'
import { otpMail } from '../Templates/otpMail.js'


var generatedOtp = Math.floor(1000 + Math.random() * 9000);

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

export const login = async (req, res) => {
    const logininfo = req.body
    userData.findOne({ username: logininfo.email })
        .then(
            dbUser => {
                if (!dbUser) {
                    return res.json({
                        message: "No such user available"
                    })
                }

                bcrypt.compare(logininfo.password, dbUser.password)
                    .then(
                        isCorrect => {
                            if (isCorrect) {
                                const payload = {
                                    id: dbUser._id,
                                    username: dbUser.email
                                }
                                jwt.sign(
                                    payload,
                                    process.env.JWT_SECRET,
                                    { expiresIn: 86400 },
                                    (err, token) => {
                                        if (err) return res.json({ message: err })
                                        return res.json({
                                            message: "Success",
                                            token: "Bearer " + token,
                                            isLoggedIn: true,
                                            username: dbUser.firstName,
                                            role: dbUser.role,
                                            status: dbUser.status
                                        })
                                    }
                                )
                            }
                            else {
                                return res.json({
                                    message: "Invalid username or password"
                                })
                            }
                        }
                    )
            }
        )
}


export const sendResetPasswordLink = async (req, res) => {
    const { email } = req.body
    userData.findOne({ email: email })
        .then(dbUser => {
            if (!dbUser) {
                res.json("No such user available!!")
            }
            else {

                var transport = nodemailer.createTransport({
                    host: 'smtp.mailtrap.io',
                    port: 587,
                    auth: {
                        user: 'cfe4a3ec13085a',
                        pass: '658d3e932cf64f',
                    },
                });
                const resetToken = makeid(25)
                let createdTime = new Date()
                let activeFlag = 0

                var mailData = {
                    from: 'noreply@domain.com',
                    to: email,
                    subject: `Password reset link`,
                    html: '<h2>Please find below the link to reset your password. The link expires in 15 minutes</h2>' +
                        `<p><a href='https://cityboxcargomovers.com/resetPassword?e=${email}&t=${resetToken}'>Click here to reset password</a></p>`
                };

                transport.sendMail(mailData, (error, info) => {
                    if (error) {
                        return console.log(error);
                    } else {
                        return console.log("Password reset link sent to your email.");
                    }
                });

                const newResetData = new PasswordResetData({ email, resetToken, createdTime, activeFlag })
                try {
                    newResetData.save()
                    res.json("Password reset link sent to your email.")
                    setInterval(() => {
                        const thisResetData = req.params.id
                        PasswordResetData.findByIdAndUpdate(thisResetData)
                            .then((resetFlag) => {
                                resetFlag.activeFlag = 1
                                resetFlag.save()
                            })
                            .catch(err => res.status(400).json('Error:' + err))
                    }, 900000);
                } catch (error) {
                    res.status(409).json({ message: error.message });
                }
            }
        })
}


export const validateResetLink = async (req, res) => {
    const { email, resetToken } = req.body
    await PasswordResetData.findOne({ email: email })
        .then(userExists => {
            if (!userExists) {
                res.json("Invalid or unauthorized access !!")
            }
            else {
                let curTime = new Date();
                let dbTime = userExists.createdTime;
                console.log(dbTime)
                var diffMs = (curTime - dbTime);
                var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
                if (curTime) {

                }
                console.log(diffMins)
            }
        })
}

export const changePassword = (req, res) => {
    const { email, newPassword, confirmPassword } = req.body

    if (newPassword === confirmPassword) {

    }
}