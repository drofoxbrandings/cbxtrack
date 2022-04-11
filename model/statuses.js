import mongoose from 'mongoose'

const statusSchema = mongoose.Schema({
    shipmentDate: { type: Date, default: Date.now },
    shipmentStatus: {type: String, default: 'new'}
})

var statusData = mongoose.model("statusData", statusSchema)

export default statusData