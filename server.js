const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const routes = require("./routes/index");
const device = require("express-device");
const route_lists = require("express-list-endpoints");
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

// app.use(
//   cors({
//     credentials: true,
//     origin: ["http://192.168.3.8", "http://192.168.168.18:3000", "http://localhost:3000"],
//   })
// );
app.use(morgan());
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1", routes);

//error handler
const port = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.json({
    Server: `Server is running at ${req.protocol}://${req.hostname}:${port}`,
    Routes: route_lists(app)
  });
});

// error handling
app.use([notFoundHandler, errorHandler]);

app.listen(port, () =>
  console.log(`Server is running at http://127.0.0.1:${port}`)
);
