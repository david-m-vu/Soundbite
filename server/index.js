import spotifyAuthRoutes from "./routes/spotifyAuth.js";
import recommendationsRoutes from "./routes/recommendations.js";

import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";

import { fileURLToPath } from "url";
import dotenv from "dotenv";
import path from "path";

/* CONFIGURATIONS */
// because we used type: modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(express.json());
app.use(morgan("common"));
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));


/* ROUTES */
app.use("/spotify", spotifyAuthRoutes);
app.use("/recommendations", recommendationsRoutes);

app.get("/", (req, res) => {
    res.json({"bro": "bro"});
})


/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
}).catch((err) => {
    console.log(`${err}. did not connect`);
})