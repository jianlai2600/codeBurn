const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// 引入路由
const usersRoutes = require("./routes/usersRoutes");
const problemsRoutes = require("./routes/problemsRoutes");
const companiesRoutes = require("./routes/companiesRoutes");
const tagsRoutes = require("./routes/tagsRoutes");
const discussionsRoutes = require("./routes/discussionsRoutes");
const solvesRoutes = require("./routes/solvesRoutes");
const appearsInRoutes = require("./routes/appearsInRoutes");
const hasTagRoutes = require("./routes/hasTagRoutes");
const statsRoutes = require("./routes/statsRoutes");
const tokenRoutes = require("./routes/tokenRoutes");

// ✅ 处理根路径 `/`，防止 404
app.get("/", (req, res) => {
    res.send("🔥 BurnCode 后端运行正常！🚀");
});

// 使用路由
app.use("/api/stats", statsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/problems", problemsRoutes);
app.use("/api/companies", companiesRoutes);
app.use("/api/tags", tagsRoutes);
app.use("/api/discussions", discussionsRoutes);
app.use("/api/solves", solvesRoutes);
app.use("/api/appearsIn", appearsInRoutes);
app.use("/api/hasTag", hasTagRoutes);
app.use("/api/google-login", tokenRoutes);

// ✅ 必须使用 Heroku 提供的 `PORT`
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🔥 Server running on port ${PORT}`);
});