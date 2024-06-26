import mongoose from "mongoose";

const statusSchema = mongoose.Schema({
  shipmentDate: { type: Date, default: Date.now },
  sStatus: String,
});

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
  consigneePostalCode: String,
  delliverLocation: String,
  deliveryCity: String,
  deliveryCountry: String,
  commodity: String,
  numberOfPackages: Number,
  pickupDate: { type: Date, default: Date.now },
  deliveryDate: { type: Date, default: Date.now },
  shipmentStatus: [
    {
      shipmentDate: { type: Date, default: new Date() },
      sStatus: { type: String },
      statusReason: { type: String },
    },
  ],
  containerNumber: String,
  expectedDepartureDate: Date,
  expectedArrivalDate: Date,
  carrierName: String,
  carrierTrackingId: String,
  carrierLink: String,
  activeFlag: Boolean,
});

var shipmentData = mongoose.model("shipmentData", shipmentSchema);

export default shipmentData;
