const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend Running Successfully");
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running"
  });
});

app.get("/api/message", (req, res) => {
  res.json({
    message: "Hello from Backend "
  });
});
app.post("/api/contact", (req, res) => {
  console.log("Form Data Received:");
  console.log(req.body);

  res.json({
    success: true,
    message: "Form Submitted Successfully"
  });
});
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});