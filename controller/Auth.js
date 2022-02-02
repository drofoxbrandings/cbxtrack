import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

import userData from '../model/user.js'
import PasswordResetData from '../model/PasswordReset.js'
import nodemailer from 'nodemailer'


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

function diff_minutes(dt2, dt1) {

    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));

}

export const login = async (req, res) => {
    const logininfo = req.body
    console.log(logininfo)
    await userData.findOne({ email: logininfo.username })
        .then(
            dbUser => {
                if (!dbUser) {
                    return res.json({
                        message: "No such user available"
                    })
                }
                else {
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
            }
        )
}


export const sendPasswordResetLink = async (req, res) => {
    const { email } = req.body
    const host = req.headers.host
    const user = await userData.findOne({ email })
    try {
        if (!user) {
            res.json({ 
                status: "404",
                message: "No such user exists !!" })
        }
        else {
            let token = PasswordResetData.findOne({ userId: user._id });
            if (token) {
                await token.deleteOne()
            };
        }
        let resetToken = makeid(25)
        const hash = await bcrypt.hash(resetToken, 10);
        var transport = nodemailer.createTransport({
            host: 'smtp.mailtrap.io',
            port: 587,
            auth: {
                user: '23fabe778b4dec',
                pass: 'b558a935e37466',
            },
        });

        var mailData = {
            from: 'noreply@domain.com',
            to: email,
            subject: `Password reset link`,
            html: '<h2>Please find below the link to reset your password. The link expires in 15 minutes</h2>' +
                `<p><a href='https://${host}/resetPassword?user=${user._id}&token=${resetToken}'>Click here to reset password</a></p>`
        };

        transport.sendMail(mailData, (error, info) => {
            if (error) {
                return console.log(error);
            }
        });
        const newResetData = new PasswordResetData({ userId: user._id, email: email, resetToken: hash, createdTime: Date.now() })
        try {

            newResetData.save()
            res.json({ status: "200", message: "Password reset link sent to your email."})
        } catch (error) {

            res.json({ status:"409", message: error.message });
        }
    } catch (error) {
        console.log(error.message)
    }

}

export const resetPassword = async (req, res) => {
    const passResetInfo = req.body

    try {
        await PasswordResetData.findOne({ userId: passResetInfo.userId })
            .then(async resetPassUser => {
                if (!resetPassUser) {
                    res.json("Invalid or expired token")
                }
                await bcrypt.compare(passResetInfo.resetToken, resetPassUser.resetToken)
                    .then(async isValid => {
                        if (!isValid) {
                            res.json("Invalid or expired token")
                        }
                        else {
                            let pwHash = await bcrypt.hash(passResetInfo.password, 10)
                            userData.findByIdAndUpdate(passResetInfo.userId)
                                .then(newPassword => {
                                    newPassword.password = pwHash
                                    newPassword.save()
                                    resetPassUser.deleteOne();
                                    res.json("Password changed successfully")
                                })
                        }
                    })


            })

    } catch (error) {
        console.log(error.message)
    }
}


export const changePassword = async (req, res) => {
    const { userId, oldPassword, newPassword } = req.body
    console.log(oldPassword)
    await userData.findOne({ _id: userId })
        .then(async theUser => {
            if (!theUser) {
                res.json("No such user exists")
            }
            else {
                await bcrypt.compare(oldPassword, theUser.password)
                    .then(async isValid => {
                        if (!isValid) {
                            res.json("Incorrect value for old password.")
                        }
                        else {
                            let pwHash = await bcrypt.hash(newPassword, 10)
                            userData.findByIdAndUpdate(userId)
                                .then(newPassword => {
                                    newPassword.password = pwHash
                                    newPassword.save()
                                    res.json("Password changed successfully")
                                })
                        }
                    })
            }
        })
}
