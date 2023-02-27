const express = require("express");
const app = express();
const cors = require("cors");
const routes = require("./routes/index");
const device = require("express-device");
const route_lists = require("express-list-endpoints");
const hrReportRouter = require("./api/hr/employeeReport/employeeReport.routes");
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
// app.use(morgan());
app.use(express.json());
app.use(cookieParser());


let requestCount = 0;
// Middleware function to log incoming requests
function logRequests(req, res, next) {
  requestCount++;
  next();
}
app.use(logRequests);


app.use("/api/v1", routes);
app.use("/api/hr/report", hrReportRouter);
//error handler
const port = process.env.PORT || 4000;


app.get("/routes", (req, res) => {
  res.json({
    requestCount,
    Server: `${req.protocol}://${req.hostname}:${port}`,
    Routes: route_lists(app).reduce((acc, route) => {
      acc += route.methods.length;
      return acc;
    }, 0)
  });
}); 0

// error handling
app.use([notFoundHandler, errorHandler]);

app.listen(port, () =>
  console.log(`Server is running at http://127.0.0.1:${port}`)
);
