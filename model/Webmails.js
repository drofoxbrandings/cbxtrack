import mongoose from "mongoose";

const webMailSchema = mongoose.Schema({
  uname: String,
  phone: String,
  email: String,
  message: String,
  readReciept: Boolean,
});

var webMailData = mongoose.model("webMailData", webMailSchema);

export default webMailData;
