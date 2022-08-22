const express = require("express");
const app = express();
const cors = require("cors");
const routes = require("./routes/index");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middlewares/error");
require("dotenv").config();

app.use(
  cors({
    credentials: true,
    origin: ["http://192.168.3.8", "http://localhost:3000"],
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(errorHandler);
app.use("/api/v1", routes);

//error handler
const port = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.json(`Server is running at ${port}`);
});

app.listen(port, () =>
  console.log(`App is listening at http://localhost:${port}`)
);
