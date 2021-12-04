# project-etu-backend

Backend курсовой работы по управлению данными
#### Установка в систему

Необходимо установить PostgreSQL

Запустить `postgresql`:

    sudo service postgresql start

Создать БД от пользователя `postgres`:

    sudo -u postgres createdb project-etu

Зайти в утилиту `psql`:

    sudo -u postgres psql project-etu

Установить пароль:

    \password

будет предложено ввести пароль. Данный пароль необходимо присвоить переменной DB_PASS файла .env (или .env.example), который лежит в директории проекта, либо ввести в psql пароль, который уже записан в .env (или .env.example). Если в проекте присутствует файл .env, то приоритет отдается ему (иначе используется .env.example).

Создать схему:

    CREATE SCHEMA IF NOT EXISTS project;

Выйти из `psql`:

    \q

### Запуск сервера

    yarn -i
    yarn build
    yarn start

или

    yarn -i
    yarn build
    yarn watch

### Загрузка тестовых данных

    yarn fill-db

### Стереть данные из базы

    yarn clear-db
