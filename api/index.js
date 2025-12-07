import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { sendEmailAndSave } from "../controllers/emailController.js";

dotenv.config();


// =======================================
// EXPRESS INIT & MIDDLEWARE
// =======================================
const app = express();


const allowedOrigins = [
    "http://127.0.0.1:3001", "https://hishamahdab.netlify.app",
];


// Set CORS policies (You can use a simple setup for local testing)
app.use(
    cors({
        // Set the origin to the robust list
        origin: allowedOrigins,
        credentials: true,
        optionsSuccessStatus: 200, 
    })
);

app.use(express.json());



// =======================================
// ROUTE DEFINITION
// =======================================

// The main endpoint that your front-end will fetch to
app.post('/api/send-email', sendEmailAndSave); 


// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint not found.' });
});


// =======================================
// START SERVER + MONGO
// =======================================

const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected Successfully");

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () =>
            console.log(`🚀 Server running on port ${PORT}`)
        );
    } catch (error) {
        console.error("❌ MongoDB Error:", error.message);
        process.exit(1);
    }
};

startServer();