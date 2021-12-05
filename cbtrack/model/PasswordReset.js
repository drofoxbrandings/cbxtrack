import mongoose from "mongoose";
const Schema = mongoose.Schema;
const PasswordResetSchema = mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },
    email: String,
    resetToken: String,
    createdTime: {
        type: Date,
        default: Date.now,
        expires: 900
    },
})

var PasswordResetData = mongoose.model("PasswordResetData", PasswordResetSchema)

export default PasswordResetData