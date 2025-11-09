-- Встановлюємо кодування для сесії
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- Налаштовуємо базу даних
ALTER DATABASE node_db CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Видаляємо стару таблицю (якщо існує)
DROP TABLE IF EXISTS test_messages;

-- Створюємо таблицю з правильним кодуванням
CREATE TABLE test_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Додаємо тестові записи
INSERT INTO test_messages (content) VALUES ('MySQL: Дані успішно завантажено.');
INSERT INTO test_messages (content) VALUES ('MySQL: Зв\'язок з Node.js встановлено.');
