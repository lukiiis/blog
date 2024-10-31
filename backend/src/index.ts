import app from "./app";
import dotenv from "dotenv";
import { connectToDatabase, closeDatabaseConnection } from "./db/connection";

dotenv.config();
const port = process.env.PORT || 8080;

const server = app.listen(port, async () => {
  await connectToDatabase();
  console.log(`Server running on port ${port}`);
});

// Graceful shutdown
const onCloseSignal = () => {
  console.log("SIGINT received, shutting down");
  server.close(async () => {
    await closeDatabaseConnection();
    console.log("Server closed");
    process.exit();
  });
  setTimeout(() => process.exit(1), 10000).unref();
};

process.on("SIGINT", onCloseSignal);
process.on("SIGTERM", onCloseSignal);
