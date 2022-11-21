const express = require("express");
const app = express();
const cors = require("cors");
const routes = require("./routes/index");
const device = require('express-device');
const cookieParser = require("cookie-parser");
const { notFoundHandler, errorHandler } = require("./middlewares/error");
require("dotenv").config();
app.use(device.capture());
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1", routes);

//error handler
const port = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.json(`Server is running at ${port}`);
});

// error handling
app.use([notFoundHandler, errorHandler]);

app.listen(port, () =>
  console.log(`App is listening at http://localhost:${port}`)
);
