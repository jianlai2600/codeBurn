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

// 使用路由
app.use("/api/users", usersRoutes);
app.use("/api/problems", problemsRoutes);
app.use("/api/companies", companiesRoutes);
app.use("/api/tags", tagsRoutes);
app.use("/api/discussions", discussionsRoutes);
app.use("/api/solves", solvesRoutes);
app.use("/api/appearsIn", appearsInRoutes);
app.use("/api/hasTag", hasTagRoutes);

// 监听 1234 端口
const PORT = 1234;
app.listen(PORT, () => {
    console.log(`🔥 Server running on port ${PORT}`);
});