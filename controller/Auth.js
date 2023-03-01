import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import userData from "../model/user.js";
import PasswordResetData from "../model/PasswordReset.js";
import nodemailer from "nodemailer";

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function diff_minutes(dt2, dt1) {
  var diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
}

export const login = async (req, res) => {
  const logininfo = req.body;
  try {
    await userData.findOne({ email: logininfo.username }).then((dbUser) => {
      if (!dbUser) {
        return res.status(404).json({
          message: "No such user available",
        });
      } else {
        bcrypt
          .compare(logininfo.password, dbUser.password)
          .then((isCorrect) => {
            if (isCorrect) {
              const payload = {
                id: dbUser._id,
                username: dbUser.email,
              };
              jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: 86400 },
                (err, token) => {
                  if (err) return res.status(401).json({ message: err });
                  return res.status(200).json({
                    message: "Success",
                    token: token,
                    username: dbUser.firstName,
                    role: dbUser.role,
                    status: dbUser.status,
                    userId: dbUser._id,
                  });
                }
              );
            } else {
              return res.status(401).json({
                message: "Invalid username or password",
              });
            }
          });
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const sendPasswordResetLink = async (req, res) => {
  const { email } = req.body;
  const host = req.headers.origin;
  const user = await userData.findOne({ email });
  try {
    if (!user) {
      res.status(404).json({
        message: "No such user exists !!",
      });
    } else {
      let token = PasswordResetData.findOne({ userId: user._id });
      if (token) {
        await token.deleteOne();
      }
    }
    let resetToken = makeid(25);
    const hash = await bcrypt.hash(resetToken, 10);
    var transport = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 587,
      auth: {
        user: "cfe4a3ec13085a",
        pass: "658d3e932cf64f",
      },
    });
    var mailData = {
      from: "noreply@domain.com",
      to: email,
      subject: `Password reset link`,
      html:
        "<h2>Please find below the link to reset your password. The link expires in 15 minutes</h2>" +
        `<p><a href='${host}/resetPassword/${user._id}/${resetToken}'>Click here to reset password</a></p>`,
    };

    transport.sendMail(mailData, (error, info) => {
      if (error) {
        return res.status(424).json({ message: error.message });
      }
    });
    const newResetData = new PasswordResetData({
      userId: user._id,
      email: email,
      resetToken: hash,
      createdTime: Date.now(),
    });
    try {
      newResetData.save();
      res
        .status(200)
        .json({ message: "Password reset link sent to your email." });
    } catch (error) {
      res.status(409).json({ message: error.message });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const passResetInfo = req.body;
  if (
    passResetInfo.userId === null ||
    passResetInfo.resetToken === null ||
    passResetInfo.password === null
  ) {
    return res
      .status(400)
      .json({ message: "Something went wrong. Try again !!" });
  } else {
    try {
      await PasswordResetData.findOne({ userId: passResetInfo.userId }).then(
        async (resetPassUser) => {
          if (!resetPassUser) {
            res.status(404).json({ message: "Invalid or expired token" });
          }
          await bcrypt
            .compare(passResetInfo.resetToken, resetPassUser.resetToken)
            .then(async (isValid) => {
              if (!isValid) {
                res.status(403).json({ message: "Invalid or expired token" });
              } else {
                let pwHash = await bcrypt.hash(passResetInfo.password, 10);
                userData
                  .findByIdAndUpdate(passResetInfo.userId)
                  .then((newPassword) => {
                    newPassword.password = pwHash;
                    newPassword.save();
                    resetPassUser.deleteOne();
                    res
                      .status(200)
                      .json({ message: "Password succesfully changed !!" });
                  });
              }
            });
        }
      );
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

export const changePassword = async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;
  await userData.findOne({ _id: userId }).then(async (theUser) => {
    if (!theUser) {
      res.status(404).json({ message: "No such user exists" });
    } else {
      await bcrypt
        .compare(oldPassword, theUser.password)
        .then(async (isValid) => {
          if (!isValid) {
            res
              .status(400)
              .json({ message: "Incorrect value for old password." });
          } else {
            let pwHash = await bcrypt.hash(newPassword, 10);
            userData.findByIdAndUpdate(userId).then((newPassword) => {
              newPassword.password = pwHash;
              newPassword.save();
              res
                .status(200)
                .json({ message: "Password changed successfully" });
            });
          }
        });
    }
  });
};
