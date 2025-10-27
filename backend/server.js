require("dotenv").config();
const path = require("path");
const app = require("./app");
const port = process.env.PORT || 5000;
const cors = require("cors");

app.use(cors({ origin: "http://localhost:3000" }));

// serve frontend build when in production
if (process.env.NODE_ENV === "production") {
  app.use(require("express").static(path.join(__dirname, "..", "frontend", "build")));
  app.get("*", (req, res) =>
    res.sendFile(path.join(__dirname, "..", "frontend", "build", "index.html"))
  );
}

app.listen(port, () => console.log("Server listening on", port));