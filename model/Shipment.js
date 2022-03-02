import mongoose from "mongoose";

const statusSchema = mongoose.Schema({
    shipmentDate: { type: Date, default: Date.now },
    status: { type: String, default: "new" }
})

const shipmentSchema = mongoose.Schema({
    shipmentRefNo: String,
    shipperName: String,
    shipperEmail: String,
    shipperPhone: String,
    shipperLocation: String,
    shipperState: String,
    shipperCountry: String,
    consigneeName: String,
    consigneeEmail: String,
    consigneePhone: String,
    delliverLocation: String,
    deliveryCity: String,
    deliveryCountry: String,
    commodity: String,
    numberOfPackages: Number,
    pickupDate: { type: Date, default: Date.now },
    deliveryDate: { type: Date, default: Date.now },
    shipmentStatus: [statusSchema],
    activeFlag: Boolean,
})

var shipmentData = mongoose.model("shipmentData", shipmentSchema)

export default shipmentData