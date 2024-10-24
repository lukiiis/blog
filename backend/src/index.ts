import app from "./app"

const port = process.env.PORT || 8080;

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const onCloseSignal = () => {
  console.log("sigint received, shutting down");
  server.close(() => {
    console.log("server closed");
    process.exit();
  });
  setTimeout(() => process.exit(1), 10000).unref(); // Force shutdown after 10s
};

process.on("SIGINT", onCloseSignal);
process.on("SIGTERM", onCloseSignal);
