const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
const clientBuildPath = path.join(__dirname, "../client/build");
console.log(clientBuildPath);
app.use(express.static(clientBuildPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});
require("dotenv").config(); // load environment variables

const connectDB = require("./config/db"); // import DB connection
const userRouter = require("./routes/userRoutes");
const movieRouter = require("./routes/movieRoute");
const theatreRouter = require("./routes/theatreRoute");
const showRouter = require("./routes/showRoutes");
const bookingsRouter = require("./routes/bookingRoute");

// console.log("server", process.env);
connectDB(); // connect to DB

/** Routes */
app.use(express.json()); // parse JSON bodies
app.use("/api/users", userRouter);
app.use("/api/movies", movieRouter);
app.use("/api/theatres", theatreRouter);
app.use("/api/shows", showRouter);
app.use("/api/bookings", bookingsRouter);

app.listen(8080, () => {
  console.log("Server is running at port 8080");
});
