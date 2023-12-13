const express = require("express");
const bodyParser = require("body-parser");
const passwordStrength = require("zxcvbn");

const app = express();
const PORT = 5000;

app.use(bodyParser.json());

app.post("/check-password-strength", (req, res) => {
  const { password } = req.body;
  const result = passwordStrength(password);
  res.json({ result: result });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
