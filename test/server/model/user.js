import  mongoose  from "mongoose";

const userSchema = mongoose.Schema({
    firstName: "",
    LastName: "",
    email: "",
    phone: "",
    emiratesId: "",
    employeeId: "",
    role: "",
    password: "",
    token: "",
    status: ""
})

var userData = mongoose.model("userData", userSchema)

export default userData