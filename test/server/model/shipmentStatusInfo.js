import mongoose from "mongoose";

const shipmentStatusInfoSchema = mongoose.Schema({
    shipmentReferenceNo: String,
    shipmentStatus: String
})

var shipmentStatusInfoData = mongoose.model("shipmentStatusInfoData", shipmentStatusInfoSchema)

export default shipmentStatusInfoData