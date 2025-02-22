const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1991Lyf@@@',  // 你的 MySQL 密码
    database: 'burncode',
    multipleStatements: true
});

connection.connect(err => {
    if (err) {
        console.error('❌ MySQL 连接失败:', err);
        process.exit(1);
    }
    console.log('✅ MySQL 连接成功！');
});

module.exports = db;