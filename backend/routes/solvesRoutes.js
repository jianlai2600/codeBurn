const express = require("express");
const router = express.Router();
const db = require("../config/db");

// 获取所有解题记录
router.get("/", (req, res) => {
    db.query("SELECT * FROM Solves", (err, results) => {
        if (err) {
            console.error("❌ Error fetching solves:", err);
            return res.status(500).json({ error: "Failed to retrieve solves" });
        }
        res.json(results);
    });
});

// 按 Solve ID 搜索（返回单条记录）
router.get("/id/:solve_id", (req, res) => {
    const { solve_id } = req.params;
    const sql = "SELECT * FROM Solves WHERE solve_id = ?";
    db.query(sql, [solve_id], (err, result) => {
        if (err) {
            console.error("Error fetching solve record:", err);
            res.status(500).json({ error: "Database error" });
        } else if (result.length === 0) {
            res.status(404).json({ error: "Solve record not found" });
        } else {
            res.json(result[0]);
        }
    });
});

// 按 User ID 搜索（返回多个记录）
router.get("/user/:user_id", (req, res) => {
    const { user_id } = req.params;
    const sql = "SELECT * FROM Solves WHERE user_id = ?";
    db.query(sql, [user_id], (err, result) => {
        if (err) {
            console.error("Error fetching solve records by user:", err);
            res.status(500).json({ error: "Database error" });
        } else {
            res.json(result);
        }
    });
});

// 按 Problem ID 搜索（返回多个记录）
router.get("/problem/:problem_id", (req, res) => {
    const { problem_id } = req.params;
    const sql = "SELECT * FROM Solves WHERE problem_id = ?";
    db.query(sql, [problem_id], (err, result) => {
        if (err) {
            console.error("Error fetching solve records by problem:", err);
            res.status(500).json({ error: "Database error" });
        } else {
            res.json(result);
        }
    });
});


// 添加解题记录
router.post("/", (req, res) => {
    console.log("📥 Received POST request:", req.body);

    const { user_id, problem_id, solve_date, attempts, status } = req.body;

    if (!user_id || !problem_id || !solve_date || !attempts || !status) {
        return res.status(400).json({ error: "All fields are required!" });
    }
    // 检查 user_id 是否存在
    db.query("SELECT user_id FROM User WHERE user_id = ?", [user_id], (err, userResult) => {
        if (err) {
            console.error("❌ Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        if (userResult.length === 0) {
            return res.status(400).json({ error: `User ID ${user_id} does not exist!` });
        }
    // 检查 problem_id 是否存在
    db.query("SELECT problem_id FROM Problem WHERE problem_id = ?", [problem_id], (err, problemResult) => {
        if (err) {
            console.error("❌ Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        if (problemResult.length === 0) {
            return res.status(400).json({ error: `Problem ID ${problem_id} does not exist!` });
        }

            // 插入 Solve 记录
            db.query(
                "INSERT INTO Solves (user_id, problem_id, solve_date, attempts, status) VALUES (?, ?, ?, ?, ?)",
                [user_id, problem_id, solve_date, attempts, status],
                (err, result) => {
                    if (err) {
                        console.error("❌ Error inserting solve:", err);
                        return res.status(500).json({ error: "Database error" });
                    }
                    res.json({ message: "Solve added successfully", solve_id: result.insertId });
                }
            );
        });
    });
});

// 删除解题记录
router.delete("/:solveId", (req, res) => {
    const { solveId } = req.params;
    db.query("DELETE FROM Solves WHERE solve_id = ?", [solveId], (err) => {
        if (err) {
            console.error("❌ Error deleting solve:", err);
            return res.status(500).json({ error: "Failed to delete solve" });
        }
        res.json({ message: "Solve deleted successfully" });
    });
});

// 更新解题记录
router.put("/:solveId", (req, res) => {
    const { solveId } = req.params;
    const { solve_date, attempts, status } = req.body;

    db.query(
        "UPDATE Solves SET solve_date = ?, attempts = ?, status = ? WHERE solve_id = ?",
        [solve_date, attempts, status, solveId],
        (err) => {
            if (err) {
                console.error("❌ Error updating solve:", err);
                return res.status(500).json({ error: "Failed to update solve" });
            }
            res.json({ message: "Solve updated successfully" });
        }
    );
});
router.get("/recent/:google_id", (req, res) => {
    const { google_id } = req.params;

    const query = `
        SELECT 
            question_id, 
            title_slug,
            solved_date, 
            status, 
            time_spent_minutes, 
            encountered_in_interview, 
            company 
        FROM user_solved_questions
        WHERE google_id = ?
        ORDER BY solved_date DESC
        LIMIT 10
    `;

    db.query(query, [google_id], (err, results) => {
        if (err) {
            console.error("❌ 查询最近做题记录失败:", err);
            return res.status(500).json({ error: "Failed to fetch recent solves" });
        }
        res.json(results);
    });
});

router.post("/add-by-google-id", (req, res) => {
    const {
        google_id,
        problem_id,
        time_spent_minutes,
        encountered_in_interview,
        company
    } = req.body;

    if (!google_id || !problem_id) {
        return res.status(400).json({ error: "Missing google_id or problem_id" });
    }

    // 获取题目的 title_slug
    const slugQuery = "SELECT title_slug FROM leetcode_questions WHERE frontend_id = ?";
    db.query(slugQuery, [problem_id], (err, slugResult) => {
        if (err || slugResult.length === 0) {
            console.error("❌ 找不到题目:", err);
            return res.status(404).json({ error: "Problem not found" });
        }

        const title_slug = slugResult[0].title_slug;
        const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

        const insertQuery = `
            INSERT INTO user_solved_questions (
                google_id, question_id, title_slug, solved_date, status,
                time_spent_minutes, encountered_in_interview, company
            ) VALUES (?, ?, ?, ?, 'AC', ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                solved_date = VALUES(solved_date),
                status = VALUES(status),
                time_spent_minutes = VALUES(time_spent_minutes),
                encountered_in_interview = VALUES(encountered_in_interview),
                company = VALUES(company)
        `;

        db.query(insertQuery, [
            google_id,
            problem_id,
            title_slug,
            today,
            time_spent_minutes || null,
            encountered_in_interview ? 1 : 0,
            company || null
        ], (err2, result2) => {
            if (err2) {
                console.error("❌ 插入解题记录失败:", err2);
                return res.status(500).json({ error: "Insert failed" });
            }

            res.json({ success: true, message: "✅ 做题记录已保存" });
        });
    });
});

router.post("/add-by-google-id", async (req, res) => {
    const {
      google_id,
      problem_id,
      time_spent_minutes,
      encountered_in_interview,
      company
    } = req.body;
  
    try {
      const [slugRow] = await new Promise((resolve, reject) => {
        db.query(
          "SELECT title_slug FROM leetcode_questions WHERE frontend_id = ?",
          [problem_id],
          (err, results) => {
            if (err) reject(err);
            else resolve(results);
          }
        );
      });
  
      if (!slugRow) return res.status(404).json({ message: "题目不存在" });
  
      const title_slug = slugRow.title_slug;
  
      await new Promise((resolve, reject) => {
        db.query(
          `
          INSERT INTO user_solved_questions 
          (google_id, question_id, title_slug, solved_date, status, time_spent_minutes, encountered_in_interview, company)
          VALUES (?, ?, ?, CURDATE(), 'AC', ?, ?, ?)
          ON DUPLICATE KEY UPDATE 
            status = 'AC',
            solved_date = CURDATE(),
            time_spent_minutes = VALUES(time_spent_minutes),
            encountered_in_interview = VALUES(encountered_in_interview),
            company = VALUES(company)
        `,
          [google_id, problem_id, title_slug, time_spent_minutes, encountered_in_interview, company],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });
  
      res.json({ message: "✅ 插入成功" });
    } catch (err) {
      console.error("❌ 插入错误", err);
      res.status(500).json({ message: "数据库错误", error: err });
    }
  });

module.exports = router;