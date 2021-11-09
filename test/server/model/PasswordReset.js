import mongoose from "mongoose";

const PasswordResetSchema = mongoose.Schema({
    email: String,
    resetToken: String,
    createdTime: {
        type: Date,
        default: Date.now,
        expires: 1800
    },
})

var PasswordResetData = mongoose.model("PasswordResetData", PasswordResetSchema)

export default PasswordResetData