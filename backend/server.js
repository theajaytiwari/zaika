// in this file we are going to start the server
require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/db/db");

const port = Number(process.env.PORT || 3000);

async function startServer() {
  await connectDB();
  app.listen(port, () => console.log(`Zaika API running on http://localhost:${port}`));
}

startServer().catch((error) => {
  console.error("Unable to start Zaika API:", error.message);
  process.exit(1);
});
