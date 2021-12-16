import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    firstName: String,
    LastName: String,
    email: String,
    phone: String,
    emiratesId: String,
    employeeId: String,
    role: String,
    password: String,
    status: String
})

var userData = mongoose.model("userData", userSchema)

export default userData