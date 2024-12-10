/* eslint-disable no-console */
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cron = require("node-cron");
const cors = require("cors");
require("dotenv-flow").config({
  node_env: process.env.NODE_ENV || "development",
});
const { ARS_SWAP } = require("./config/constants");
const { setExchangesLoop } = require("./concordium/setExchangesLoop");
const routes = require("./routes");
const { setBlocksStream } = require("./concordium/setBlocksStream");

const port = process.env.PORT;
const dbUser = process.env.DBUSER;
const dbPass = process.env.DBPASS;
const dbHost = process.env.DBHOST;
const cronOptions = process.env.CRON_OPTIONS;
const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
mongoose
  .connect(`mongodb+srv://${dbUser}:${dbPass}@${dbHost}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  // eslint-disable-next-line no-console
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("DB connection failed.", " error:", err);
    process.exit(1);
  });

// Error handling Middleware function for logging the error message
const errorLogger = (error, req, res, next) => {
  console.error("✔️ ➡️ file: server.js:41 ➡️ errorLogger ➡️ error:", error);
  next(error);
};

// Error handling Middleware function reads the error message
// and sends back a response in JSON format
// eslint-disable-next-line no-unused-vars
const errorResponder = (error, req, res, next) => {
  const status = error.status || 500;
  res.status(status).json({
    message: `Error happened on server: "${error.message}" `,
  });
};

// Fallback Middleware function for returning
// 404 error for undefined paths
// eslint-disable-next-line no-unused-vars
const invalidPathHandler = (req, res, next) => {
  res.status(404).json({
    message: "Invalid path",
  });
};

app.use("/api/v1", routes);
app.use(errorLogger);
app.use(errorResponder);
app.use(invalidPathHandler);
app.listen(port, () => {
  console.log(`Running ars-backend-js API on port ${port}`);
});

setExchangesLoop(
  ARS_SWAP,
  "getExchanges",
  {
    holder: {
      Contract: [{ index: +ARS_SWAP.index, subindex: +ARS_SWAP.subindex }],
    },
  },
  cronOptions
);

setBlocksStream();
