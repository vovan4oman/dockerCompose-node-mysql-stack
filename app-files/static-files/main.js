const button = document.getElementById('testBtn');
const resultDiv = document.getElementById('result');

button.addEventListener('click', async () => {
    resultDiv.textContent = 'Виконується запит...';
    resultDiv.className = '';

    try {
        const response = await fetch('/api/test-db');
        if (!response.ok) throw new Error('HTTP помилка: ' + response.status);

        const data = await response.json();
        resultDiv.textContent = data.message + (data.data_from_db ? ' Дані: ' + data.data_from_db : '');
        resultDiv.className = data.status;
    } catch (err) {
        resultDiv.textContent = 'Помилка запиту: ' + err.message;
        resultDiv.className = 'error';
    }
});
