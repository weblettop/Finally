```bash
# 1. Переконатися, що ми на main і вона актуальна
git checkout main
git pull origin main

# 2. Створити гілку dev від main і одразу перейти на неї
git checkout -b dev

# 3. Опублікувати dev на GitHub і зв'язати з віддаленою гілкою
git push -u origin dev
```

git branch -a

# очікувано:mat

# \* dev

# main

# remotes/origin/dev

# remotes/origin/main

```


git switch -c start dev.

npm i -D prettier-standard
- `node_modules/` не комітять: перевірте, що він є в `.gitignore`.

npx prettier-standard --format


rm -rf node_modules package.json package-lock.json
git add .
git commit -m "style: format code with prettier-standard"
```

Перевірити докер
Що в порядку
Docker 29.7 і Compose v5.5 встановлені, порти 3000, 5000, 12345 і 12346 вільні.
Імена хостів баз у конфігах збігаються з назвами сервісів: db-dev у postgresConfig.json і mongo-dev у mongoConfig.json.
Логін, пароль і назва бази Postgres (postgres / password / todo-dev) однакові в compose і в конфігу.
Порти: фронтенд відкривається на localhost:5000 (усередині контейнера Vite слухає 3000), бекенд — на localhost:3000. Клієнт звертається до localhost:3000 (constants.js), і це збігається.

1. docker compose -f docker-compose-dev.yaml up -d --build

docker compose -f docker-compose-dev.yaml up --build
Перший запуск триває кілька хвилин: Docker завантажить образи і виконає npm install. Дочекайтеся в логах рядка Example app listening on port 3000!.

Сервер падав, бо образ node:lts-alpine тепер містить Node 26, а старий пакет авторизації (jsonwebtoken@8) несумісний з Node 25 і новіше. Щоб це виправити, я зафіксував Node 22 у server/Dockerfile і client/Dockerfile: ARG VERSION=22-alpine.

1.1 Що зробити:
У терміналі з логами натисніть Ctrl+C.
Виконайте:

docker compose -f docker-compose-dev.yaml down -v
docker compose -f docker-compose-dev.yaml up --build
--build обов'язковий, інакше Docker запустить старий образ з Node 26. -v видаляє томи: старі node_modules і дані баз. Для першого запуску це не страшно.
Дочекайтеся в логах рядка Example app listening on port 3000!, а потім у другому терміналі виконайте міграції та сіди з розділу

2. Відкрийте другий термінал (кнопка +) і виконайте:
   docker compose -f docker-compose-dev.yaml ps
   docker compose -f docker-compose-dev.yaml exec server-dev npx sequelize-cli db:migrate
   docker compose -f docker-compose-dev.yaml exec server-dev npx sequelize-cli db:seed:all

   ТРЕБА ВИЙТИ З КОНТЕЙНЕРА
   exit

# 1. таблиці

docker compose -f docker-compose-dev.yaml exec server-dev npx sequelize-cli db:migrate

# 2. створити заготовку сіда--Додай сід на 2 користувача 1 ролі квтіуртор 1 роль кастомер

docker compose -f docker-compose-dev.yaml exec server-dev npx sequelize-cli seed:generate --name users

# 3. ЗАПОВНИТИ файл у VS Code і зберегти (Ctrl+S)

# 4. запустити сіди

docker compose -f docker-compose-dev.yaml exec server-dev npx sequelize-cli db:seed:all

# або лише цей сід:

docker compose -f docker-compose-dev.yaml exec server-dev npx sequelize-cli db:seed --seed 20261125120000-users.js
