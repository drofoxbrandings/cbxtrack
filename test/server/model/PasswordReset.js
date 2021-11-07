import mongoose from "mongoose";

const PasswordResetSchema = mongoose.Schema({
    email: String,
    resetToken: String,
    createdTime: {
        type: Date,
        default: Date.now
    },
    activeFlag: Boolean,
})

var PasswordResetData = mongoose.model("PasswordResetData", PasswordResetSchema)

export default PasswordResetData