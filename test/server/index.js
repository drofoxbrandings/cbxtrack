
import mongoose from "mongoose";
import * as ENV from 'dotenv'
import cors from 'cors'
import express from 'express'
import userRoutes from './routes/Users.js';

ENV.config()
const app = express()

app.use(express.json());
app.use(cors({
    origin: "http://localhost"
}))


app.use('/api', userRoutes);


const CONNECTION_URL = process.env.CONNECTION_URL;
const PORT = process.env.PORT || 5000;

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`Connected to: ${PORT}`)))
    .catch((error) => (
        console.log(error.message)
    ))

