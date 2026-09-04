const mongoose = require('mongoose');

async function connectDB() {
    if (!process.env.MONGODB_URL) {
        throw new Error("MONGODB_URL is missing. Add it to backend/.env.");
    }

    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB connected");
}

module.exports = connectDB;
