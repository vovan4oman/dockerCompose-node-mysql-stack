document.getElementById('sendMessageBtn').addEventListener('click', () => {
    const container = document.getElementById('message-container');
    container.innerHTML = 'Надсилаємо запит до Node.js... ⏳';
    container.style.color = '#333';
    container.style.backgroundColor = '#fff9c4';

    // API запит, який Nginx проксує до Node:3000/api/message
    fetch('/api/message')
        .then(response => {
            if (!response.ok) {
                throw new Error('API не відповідає або повернуло помилку.');
            }
            return response.json();
        })
        .then(data => {
            // Перевіряємо, чи отримали ми очікуваний ключ "message"
            if (data && data.message) {
                container.innerHTML = `✅ ${data.message}`;
                container.style.color = '#00695c';
                container.style.backgroundColor = '#e0f2f1';
            } else {
                container.innerHTML = `❌ Помилка: Отримано невірний формат даних: ${JSON.stringify(data)}`;
                container.style.color = '#c62828';
                container.style.backgroundColor = '#ffcdd2';
            }
        })
        .catch(error => {
            container.innerHTML = `❌ Помилка: ${error.message}. Перевірте логі Node.js.`;
            container.style.color = '#c62828';
            container.style.backgroundColor = '#ffcdd2';
        });
});
