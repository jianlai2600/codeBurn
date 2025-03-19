const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'database-1.cpe0kkg0uyqt.us-east-2.rds.amazonaws.com', // 你的 RDS 终端节点
    user: 'admin',  // 你的 RDS 用户名
    password: '1991Lyf!!!',  // 你的 RDS 密码
    database: 'burncode',  // 你的数据库名称
    port: 3306,  // RDS MySQL 默认端口
    multipleStatements: true
});

db.connect(err => {
    if (err) {
        console.error('❌ Amazon RDS MySQL 连接失败:', err);
        process.exit(1);
    }
    console.log('✅ 连接 Amazon RDS MySQL 成功！');
});

module.exports = db;