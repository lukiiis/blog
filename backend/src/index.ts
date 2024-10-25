import app from "./app";
import "./loadEnvironment";
import { connectToDatabase } from './db/connection';

const port = process.env.PORT || 8080;

async function startServer() {
  try {
    await connectToDatabase();

    const server = app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

    const onCloseSignal = () => {
      console.log("SIGINT received, shutting down");
      server.close(() => {
        console.log("Server closed");
        process.exit();
      });
      setTimeout(() => process.exit(1), 10000).unref();
    };

    process.on("SIGINT", onCloseSignal);
    process.on("SIGTERM", onCloseSignal);
  } catch (err) {
    console.error("Failed to start the server due to database connection error:", err);
    process.exit(1);
  }
}

startServer();