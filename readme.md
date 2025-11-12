# Node.js + Nginx + MySQL Docker Application

Повний стек веб-застосунку з Node.js backend, Nginx reverse proxy та MySQL базою даних, containerized за допомогою Docker Compose.


##  Архітектура

Застосунок складається з трьох основних сервісів:

```

    Клієнт    

       │
       ▼
 
     Nginx    │ :81
   (Reverse    
     Proxy)    
 
       │
       ▼

    Node.js   │ :3000
    Backend    

       │
       ▼

     MySQL    │ :3306
    Database  

```

## Сервіси:

- **Nginx** - веб-сервер та reverse proxy, обробляє статичні файли та проксує запити до Node.js
- **Node.js** - backend застосунок, обробляє API запити
- **MySQL** - реляційна база даних з підтримкою UTF-8

##  Технології

- **Docker** & **Docker Compose** - контейнеризація
- **Node.js** - JavaScript runtime для backend
- **Nginx** - веб-сервер та reverse proxy
- **MySQL 5.7** - реляційна база даних

##  Передумови

Перед запуском переконайся, що у тебе встановлено:

- [Docker](https://docs.docker.com/get-docker/) (версія 20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (версія 1.29+)

Перевір версії:
```bash
docker --version
docker compose --version
```

## Швидкий старт

### 1. Клонуй репозиторій

```bash
git clone <url>
cd <nodeserver>
```

### 2. Створи `.env` файл

Створи файл `.env` в корені проєкту з наступними змінними:

```env
# MySQL Root Password
MYSQL_ROOT_PASSWORD=your_strong_root_password

# Database Configuration
MY_DB=your_database_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=mysql
```

*** Ніколи не коміть `.env` файл у Git! Додай його в `.gitignore`.

### 3. Підготуй файли конфігурації

Переконайся, що у тебе є:

- `dockerfile` - Dockerfile для Node.js застосунку
- `./app-files/` - код Node.js Back-end-у та JS+HTML Frond-End-у застосунку 
- `./nginxconf/` - конфігураційні файли Nginx
- `./init.sql` - SQL скрипт ініціалізації бази даних (опціонально)

### 4. Запусти застосунок

```bash
# Збудуй та запусти всі контейнери
docker compose up -d

# Перевір статус контейнерів
docker compose ps

# Подивись логи
docker compose logs -f
```

### 5. Перевір роботу

- **Веб-застосунок:** http://localhost:81
- **API health check:** http://localhost:81/api/test-db

##
##  Volumes

- `mysql-node:/var/lib/mysql` - персистентне сховище даних MySQL
- `./app-files/` - код Node.js Back-end-у та JS+HTML Frond-End-у застосунку
- `./nginxconf/` - конфігурація Nginx
- `./init.sql` - SQL скрипт ініціалізації

## Структура проєкту

```
project/
├── docker-compose.yml          # Головний файл Docker Compose
├── dockerfile                  # Dockerfile для Node.js
├── .env                        # Змінні оточення (НЕ коміть!)
├── init.sql                    # SQL ініціалізація
├── app-files/                  # Node.js застосунок
│   ├── package.json
│   ├── index.js
│   └── static-files/          # Статичні файли (HTML, CSS, JS, images)
└── nginxconf/                  # Nginx конфігурація
    └── default.conf
```

## Залежності запуску

MySQL (healthy) → Node.js (healthy) → Nginx

Контейнери запускаються в правильному порядку завдяки `depends_on` та `condition: service_healthy`.

## Мережі

Застосунок використовує дві ізольовані мережі:

backend_net : 
- З'єднує: Node.js ↔ MySQL
- Призначення: Безпечна комунікація між backend та БД

frontend_net :
- З'єднує: Nginx ↔ Node.js
- Призначення: Обробка клієнтських запитів

Це забезпечує додатковий рівень безпеки - MySQL недоступна напряму з зовнішньої мережі.


## Безпека

- MySQL доступна тільки через внутрішню мережу
- Node.js API доступний тільки через Nginx
- Використання `.env` для чутливих даних
- Nginx конфіги readonly mount
- Змінити дефолтні паролі перед production
- Використати HTTPS в production (додати SSL сертифікати)

