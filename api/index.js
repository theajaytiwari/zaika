const app = require("../backend/src/app");
const connectDB = require("../backend/src/db/db");

let databaseConnection;

module.exports = async (req, res) => {
  try {
    if (!databaseConnection) databaseConnection = connectDB();
    await databaseConnection;
    return app(req, res);
  } catch (error) {
    databaseConnection = null;
    console.error("Database connection error:", error.message);
    return res.status(500).json({ message: "Zaika is temporarily unavailable. Please try again." });
  }
};
