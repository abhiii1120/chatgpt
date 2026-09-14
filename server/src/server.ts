import { app } from "./app/app.js";
import { connectDB } from "./config/db.js";

async function createServer() {
  await connectDB();

  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
}

createServer().catch((error) => {
  console.error("failed to start server", error);
  process.exit(1);
});
