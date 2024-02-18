const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/message", (req, res) => {
  res.json({ message: "Hello from server aarush is a nigger!" });
});

app.listen(8000, () => {
  console.log(`Server is running on port 8000.`);
});