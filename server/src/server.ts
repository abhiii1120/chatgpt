import { app } from "./app/app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";

async function createServer() {
  await connectDB();

  app.listen(env.port, () => {
    console.log(`Server is running on port ${env.port}`);
  });
}

createServer().catch((error) => {
  console.error("failed to start server", error);
  process.exit(1);
});
