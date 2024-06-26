require("dotenv").config(); // ALLOWS ENVIRONMENT VARIABLES TO BE SET ON PROCESS.ENV SHOULD BE AT TOP
const cors = require('cors');
const express = require("express");
const app = express();
app.use(cors());
// Middleware
app.use(express.json()); // parse json bodies in the request object

// Redirect requests to endpoint starting with /posts to postRoutes.js
app.use("/users", require("./routes/userRoutes"));
app.use("/posts", require("./routes/postRoutes"));
app.use("/contents", require("./routes/contentRoutes"));
app.use("/comments", require("./routes/commentRoutes"));

// Global Error Handler. IMPORTANT function params MUST start with err
app.use((err, req, res, next) => {
  console.log(err.stack);
  console.log(err.name);
  console.log(err.code);

  res.status(400).json({
    message: "...",
  });
  res.status(500).json({
    message: "Something went rely wrong",
  });
});

// Listen on pc port
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
