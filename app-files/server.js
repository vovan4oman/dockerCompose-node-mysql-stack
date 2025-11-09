const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const PORT = 3000;

// Додаємо сервінг статичних файлів (JS, CSS)
app.use(express.static(__dirname));

// Встановлюємо правильні заголовки для всіх відповідей
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next();
});

// Конфігурація MySQL
const dbConfig = {
    host: process.env.DB_HOST || 'mysql',
    user: process.env.DB_USER || 'node_user',
    password: process.env.DB_PASSWORD || 'user123',
    database: process.env.DB_DATABASE || 'node_db',
    waitForConnections: true,
    connectionLimit: 10,
    charset: 'utf8mb4',
    // Додаткові параметри для правильного кодування
    typeCast: function (field, next) {
        if (field.type === 'VAR_STRING' || field.type === 'STRING' || field.type === 'TINY_BLOB' || field.type === 'MEDIUM_BLOB' || field.type === 'LONG_BLOB' || field.type === 'BLOB') {
            return field.string();
        }
        return next();
    }
};

const pool = mysql.createPool(dbConfig);

// Віддаємо HTML
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// API для тесту бази
app.get('/api/test-db', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        
        // Примусово встановлюємо кодування на utf8mb4 для кожної сесії
        await conn.query("SET NAMES utf8mb4");
        await conn.query("SET CHARACTER SET utf8mb4");
        
        // ВАЖЛИВО: використовуємо conn.query, а не pool.query!
        const [rows] = await conn.query("SELECT id, content FROM test_messages LIMIT 1");
        
        if (rows.length > 0) {
            res.json({
                status: 'success',
                message: 'Підключення до MySQL успішне. Дані з таблиці отримано.',
                data_from_db: rows[0].content
            });
        } else {
            res.json({
                status: 'warning',
                message: 'Підключення успішне, але таблиця порожня.'
            });
        }
    } catch (err) {
        console.error('MySQL Error:', err);
        res.status(500).json({
            status: 'error',
            message: 'Помилка підключення або виконання запиту до бази.',
            error: err.code
        });
    } finally {
        if (conn) conn.release(); // Не забуваємо повернути з'єднання в пул
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Node.js сервер запущено на http://0.0.0.0:${PORT}/`);
});
