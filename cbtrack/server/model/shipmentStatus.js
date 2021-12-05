import mongoose from "mongoose";

const shipmentStatusSchema = mongoose.Schema({
    shipmentStatus: String,
})

var shipmentStatusData = mongoose.model("shipmentStatusData", shipmentStatusSchema)

export default shipmentStatusData