require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("LeetCode 平台后端运行成功！");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`后端运行在端口 ${PORT}`));