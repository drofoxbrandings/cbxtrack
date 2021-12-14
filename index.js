
import mongoose from "mongoose";
import * as ENV from 'dotenv'
import cors from 'cors'
import express from 'express'
import userRoutes from './routes/Users.js';
import webMailRoutes from './routes/Webmails.js';
import ShipmentStatusRoutes from './routes/ShipmentStatus.js';
import ShipmentRoutes from './routes/Shipment.js';
import AuthRoutes from './routes/Auth.js';
import path from 'path'

ENV.config()
const app = express()

app.use(express.json());
app.use(cors({
    // origin: "http://localhost"
}))

const __dirname = path.resolve();


app.use('/api/user', userRoutes);
app.use('/api/mails', webMailRoutes);
app.use('/api/shipment/status', ShipmentStatusRoutes);
app.use('/api/shipment', ShipmentRoutes);
app.use('/api/auth', AuthRoutes);
app.use(express.static(path.join(__dirname, "client", "build")))


const CONNECTION_URL = process.env.CONNECTION_URL;
const PORT = process.env.PORT || 5000;

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

mongoose.connect(`${CONNECTION_URL}`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`Connected to: ${PORT}`)))
    .catch((error) => (
        console.log(error.message)
    ))

