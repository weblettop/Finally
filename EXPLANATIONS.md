# Пояснення до роботи з проєктом

## 1. Підготовка: `main` → `dev`

**Мета:** не працювати напряму в `main`. Гілка `main` лишається стабільною (те, що «здається»/деплоїться), а вся розробка йде в `dev`.

### Поточний стан

- Є лише гілка `main` (локально і `origin/main`).
- Останній коміт: `9154f29 Start finally`.
- Робоче дерево чисте.

### Кроки

```bash
# 1. Переконатися, що ми на main і вона актуальна
git checkout main
git pull origin main

# 2. Створити гілку dev від main і одразу перейти на неї
git checkout -b dev

# 3. Опублікувати dev на GitHub і зв'язати з віддаленою гілкою
git push -u origin dev
```

### Що робить кожна команда

| Команда                  | Пояснення                                                                                       |
| ------------------------ | ----------------------------------------------------------------------------------------------- |
| `git checkout main`      | перейти на гілку `main`                                                                         |
| `git pull origin main`   | підтягнути останні зміни з GitHub, щоб `dev` стартувала з актуального коду                      |
| `git checkout -b dev`    | створити нову гілку `dev` з поточного коміту та переключитися на неї                            |
| `git push -u origin dev` | відправити `dev` на `origin`; `-u` запам'ятовує зв'язок, далі достатньо `git push` / `git pull` |

### Перевірка

```bash
git branch -a
# очікувано:
# * dev
#   main
#   remotes/origin/dev
#   remotes/origin/main
```

### Подальший робочий процес

1. Працюємо в `dev` (або у feature-гілках від `dev`: `git checkout -b feature/назва dev`).
   або git switch -c feature/назва dev
   Повна послідовність:

git checkout -b dev # створити dev від main
git push -u origin dev
git checkout -b start dev # створити start від dev
git push -u origin start # за потреби відправити на GitHub

Сучасний аналог тієї ж команди:
git switch -c start dev.

2. Комітимо та пушимо в `dev`.
3. Коли етап готовий — зливаємо `dev` → `main` (через Pull Request на GitHub або `git checkout main && git merge dev && git push`).

### Щоразу: закомітити `start` і відправити зміни в `dev`

Схема: `start` (робоча гілка) → `dev`. Блок можна виконувати після кожного завершеного кроку.

```bash
cd /media/data419/2025/0/000finally/exam-project-main_my

# 1. Закомітити роботу в start
git switch start
git status                          # подивитися, що змінено (немає .env, node_modules?)
git add .
git commit -m "опис що зроблено"
git push origin start               # перший раз: git push -u origin start

# 2. Влити start у dev і відправити на GitHub
git switch dev
git pull origin dev                 # підтягнути актуальний dev
git merge start                     # влити зміни зі start
git push origin dev

# 3. Повернутися працювати далі в start
git switch start
```

| Крок                 | Пояснення                                                                     |
| -------------------- | ----------------------------------------------------------------------------- |
| `git status`         | перевірити перед `add .`, щоб не закомітити секрети чи зайве                  |
| `git commit -m`      | короткий опис: «додав ролі користувачам», «виправив сід» тощо                 |
| `git pull origin dev`| якщо на GitHub у `dev` щось змінилось, спочатку забрати, інакше push відхилять |
| `git merge start`    | переносить усі нові коміти зі `start` у `dev`                                 |

**Якщо `git merge` показав конфлікт:** відкрити файли з `<<<<<<<` у VS Code, обрати потрібний варіант (Accept Current / Incoming / Both), потім `git add .` і `git commit`. Скасувати злиття повністю: `git merge --abort`.

**Альтернатива через GitHub:** запушити `start` (крок 1) і на GitHub створити Pull Request `start` → `dev`, натиснути **Merge**. Потім локально: `git switch dev && git pull`.

---

## 2. Clone чи Fork: як отримати проєкт викладача

### Різниця

|                      | **Clone** (`git clone`)                                     | **Fork** (кнопка на GitHub)                                        |
| -------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------ |
| Де з'являється копія | локально на ПК                                              | у вашому акаунті на GitHub                                         |
| Зв'язок з оригіналом | `origin` = репозиторій викладача, пушити туди ви не зможете | GitHub пам'ятає, що це форк, можна зробити Pull Request в оригінал |
| Для чого             | лише подивитися або запустити код                           | працювати над чужим проєктом і пропонувати зміни автору            |

Fork створює копію лише на GitHub. Щоб працювати на ПК, його все одно потрібно клонувати.

### Варіант A: Fork, потім Clone

Підходить, якщо викладач приймає роботи через Pull Request або хоче бачити зв'язок з оригіналом. Це стандарт для open source.

```bash
# 1. На GitHub натиснути Fork, і з'явиться ваш-акаунт/проєкт
git clone https://github.com/ваш-акаунт/проєкт.git
cd проєкт

# 2. Додати оригінал, щоб отримувати оновлення від викладача
git remote add upstream https://github.com/викладач/проєкт.git
git fetch upstream
git merge upstream/main      # підтягнути зміни викладача
```

- `origin` — ваш форк (сюди пушите);
- `upstream` — оригінал викладача (звідси лише підтягуєте зміни).

### Варіант B: Clone, потім власний новий репозиторій

Підходить для власного навчального чи екзаменаційного проєкту, коли потрібна незалежна копія, наприклад для портфоліо.

```bash
git clone https://github.com/викладач/проєкт.git
cd проєкт

# на GitHub створити ПОРОЖНІЙ репозиторій (без README), наприклад Finally
git remote rename origin upstream          # оригінал залишаємо як upstream
git remote add origin https://github.com/ваш-акаунт/Finally.git
git push -u origin main
```

Вся історія комітів зберігається, а репозиторій повністю ваш, без позначки «forked from».

### Що обрати

- Якщо викладач каже здавати через **Pull Request**, обирайте **Варіант A (Fork)**.
- Якщо треба просто здати **посилання на свій репозиторій**, підходять обидва варіанти. **Варіант B** дає «чистіший» репозиторій для портфоліо.
- Тільки `git clone` без власного репозиторію **не підходить**: пушити не буде куди.

### Перевірка, що налаштовано

```bash
git remote -v
# origin    https://github.com/ваш-акаунт/... (fetch/push)
# upstream  https://github.com/викладач/...   (fetch/push)
```

Чи є репозиторій форком, видно на сторінці GitHub: під назвою з'являється напис «forked from автор/репозиторій».

---

## 3. Куди `git clone` копіює проєкт на ПК

`git clone` створює **нову папку в поточній директорії**, тобто там, де ви зараз у терміналі. Папка називається так само, як репозиторій, тільки без `.git`.

```bash
cd /media/data419/2025/0/000finally
git clone https://github.com/викладач/exam-project.git
# з'явиться /media/data419/2025/0/000finally/exam-project/
```

Поточну папку показує команда `pwd`.

### Інші варіанти

```bash
# склонувати в папку з власною назвою
git clone https://github.com/викладач/exam-project.git my-project

# склонувати за конкретним шляхом
git clone https://github.com/викладач/exam-project.git /home/user/projects/my-project

# склонувати прямо в поточну папку (вона має бути порожня)
git clone https://github.com/викладач/exam-project.git .
```

Після клонування потрібно перейти в нову папку: `cd exam-project`. Git-команди працюють лише всередині неї.

### Через VS Code

`Ctrl+Shift+P` → **Git: Clone** → вставити посилання. Програма сама запитає, у яку папку зберегти.

---

## 4. Навіщо `rm -rf .git`

`rm -rf .git` видаляє папку `.git`, у якій Git зберігає **всю історію репозиторію**: коміти, гілки, налаштування `remote` (`origin`). Файли проєкту залишаються, але папка перестає бути git-репозиторієм і стає звичайною папкою з кодом.

| Частина | Значення                           |
| ------- | ---------------------------------- |
| `rm`    | видалити                           |
| `-r`    | рекурсивно, тобто разом із вмістом |
| `-f`    | без підтверджень і помилок         |
| `.git`  | прихована службова папка Git       |

### Навіщо це роблять

Найчастіше це роблять, щоб **почати проєкт «з чистого аркуша»** після клонування чужого репозиторію:

```bash
git clone https://github.com/викладач/exam-project.git Finally
cd Finally
rm -rf .git                 # прибрати історію і зв'язок з репозиторієм викладача
git init                    # створити новий порожній репозиторій
git add .
git commit -m "Start finally"
git branch -M main
git remote add origin https://github.com/ваш-акаунт/Finally.git
git push -u origin main
```

Результат:

- у вашому репозиторії **лише ваші коміти**, а історії викладача немає;
- немає зв'язку з оригіналом, тож випадково запушити туди не вийде;
- на GitHub репозиторій виглядає як повністю ваш проєкт.

### Порівняння з варіантами з розділу 2

|                                    | Історія викладача | Зв'язок з оригіналом         |
| ---------------------------------- | ----------------- | ---------------------------- |
| Fork                               | є                 | є (forked from)              |
| Clone + новий remote (варіант B)   | є                 | можна залишити як `upstream` |
| Clone + `rm -rf .git` + `git init` | **немає**         | **немає**                    |

### Обережно

- Цю дію **не можна скасувати**: уся локальна історія, гілки та незапушені коміти зникнуть.
- Перед виконанням перевірте командою `pwd`, що ви в потрібній папці.
- Не виконуйте `rm -rf` з іншими шляхами навмання, бо ця команда видаляє без запитань.

---

## 5. Встановлення `prettier` і `standard`

### Що це

| Пакет      | Призначення                                                                                  |
| ---------- | -------------------------------------------------------------------------------------------- |
| `prettier` | **форматер**: автоматично вирівнює код (відступи, лапки, крапки з комою, перенесення рядків) |
| `standard` | **лінтер + стиль** JavaScript Standard Style: шукає помилки й вимагає певного стилю коду     |

### Стан проєкту

- У **корені немає `package.json`**, є лише `client/package.json` і `server/package.json`.
- У корені вже є `.prettierrc.json`:
  ```json
  { "semi": true, "trailingComma": "es5", "singleQuote": true }
  ```
- У `client` і `server` уже налаштовано **ESLint з конфігом airbnb**.

### ⚠️ Конфлікт `standard` і `prettier`

- `standard` вимагає писати **без крапок з комою** (`;`), а `.prettierrc.json` їх **ставить** (`"semi": true`).
- `standard` також конфліктує з ESLint airbnb, який уже є в `client` і `server`.

Тому ці інструменти правлять код по-різному. Зазвичай обирають щось одне:

- **prettier + ESLint**: найпоширеніший варіант, і в цьому проєкті він уже майже налаштований;
- **лише standard**: тоді прибирають `.prettierrc.json` і airbnb.

### Як встановити

Пакети ставлять як **devDependencies** (`-D`), бо вони потрібні лише під час розробки, а не в продакшені.

**Варіант 1: у корені проєкту** (спільно для client і server)

```bash
cd /media/data419/2025/0/000finally/exam-project-main_my
npm init -y                     # створити кореневий package.json
npm i -D prettier               # лише prettier (рекомендовано)
# або обидва:
npm i -D prettier standard
```

**Варіант 2: окремо в кожній частині**

```bash
cd client && npm i -D prettier && cd ..
cd server && npm i -D prettier && cd ..
```

### Використання

```bash
npx prettier --check .          # перевірити, що відформатовано
npx prettier --write .          # відформатувати всі файли
npx standard                    # перевірити код за standard
npx standard --fix              # автоматично виправити те, що можливо
```

Зручно додати скрипти в `package.json`:

```json
"scripts": {
  "format": "prettier --write .",
  "lint": "standard"
}
```

Після цього запускати можна командами `npm run format` / `npm run lint`.

### Пов'язане

- `node_modules/` не комітять: перевірте, що він є в `.gitignore`.
- `package.json` і `package-lock.json` **комітять**.

---

## 6. `.gitignore` → `node_modules/` і форматування через `prettier-standard`

### Крок 1: ігнорувати `node_modules/`

У кінець `.gitignore` додано рядок:

```gitignore
node_modules/
```

- Цей рядок ігнорує папку `node_modules` **на будь-якому рівні**: у корені, `client/`, `server/`.
- Рядки на зразок `./client/node_modules/` **не працюють**, бо Git не розуміє префікс `./`.
- Це треба зробити **до** встановлення пакетів і форматування, щоб у коміт не потрапили тисячі файлів залежностей, а форматер не обробляв `node_modules`.

Перевірка:

```bash
git status --short | grep node_modules    # має бути порожньо
git check-ignore -v node_modules          # покаже, яке правило спрацювало
```

### Крок 2: встановити `prettier-standard`

`prettier-standard` поєднує обидва інструменти: **prettier** форматує, а **standard** перевіряє.

```bash
npm i -D prettier-standard
```

- `-D` (`--save-dev`) записує пакет у `devDependencies`, бо він потрібен лише під час розробки.
- Команда створює в корені `package.json`, `package-lock.json` і `node_modules/`.

> Якщо встановити без `-D`, пакет потрапить у `dependencies`. Щоб перенести його, виконайте
> `npm i -D prettier-standard` ще раз: npm сам перемістить пакет у `devDependencies`.

### Крок 3: відформатувати весь проєкт

```bash
npx prettier-standard --format
```

| Команда                                  | Що робить                                           |
| ---------------------------------------- | --------------------------------------------------- |
| `npx prettier-standard --format`         | лише форматує всі файли (без перевірки lint)        |
| `npx prettier-standard --lint`           | форматує й перевіряє правилами standard             |
| `npx prettier-standard --changed`        | лише файли, змінені відносно останнього коміту      |
| `npx prettier-standard --check`          | лише перевіряє, нічого не змінюючи                  |

- Файли з `.gitignore` пропускаються.
- Налаштування з `.prettierrc.json` враховуються, тому в коді **залишились `;` та одинарні лапки**.

### Крок 4: переглянути та закомітити окремо

Форматування змінює багато файлів (у цьому проєкті змінилося 93 файли). Професійно це роблять **окремим комітом**, без змін логіки, щоб історію було легко читати:

```bash
git diff --stat                     # подивитися, що змінилось
git add .
git commit -m "style: format code with prettier-standard"
```

Скрипт у `package.json` для зручності:

```json
"scripts": {
  "format": "prettier-standard --format"
}
```

Після цього форматувати можна командою `npm run format`.

---

## 7. Коміт і навіщо видаляти кореневі `package.json`, `package-lock.json`, `node_modules`

### Як зробити коміт

```bash
git status                  # що змінено
git diff --stat             # коротко: які файли і скільки рядків
git add .                   # додати всі зміни в індекс (staging)
git commit -m "style: format code with prettier-standard"
git push                    # відправити на GitHub
```

- Вибірково: `git add client server` додасть лише ці папки.
- Перший `git push` нової гілки потребує прапорця `-u`: `git push -u origin dev`.

### Навіщо викладач видаляє ці файли в корені

`package.json`, `package-lock.json` і `node_modules/` з'явились у корені лише тому, що туди встановили `prettier-standard`. Він потрібен **разово**, щоб відформатувати код, і більше не використовується.

1. **Корінь не є npm-проєктом.** Справжні проєкти — це `client/` і `server/`, кожен зі своїм `package.json`. Docker і скрипти `start.sh` збирають саме їх. Кореневий `package.json` нічого не запускає і лише плутає: здається, що в корені є третій проєкт.
2. **`node_modules` — це згенеровані файли.** Їх завжди можна відновити командою `npm i`. Вони важать сотні мегабайтів, тож їх не комітять і не тримають, якщо вони не потрібні.
3. **Чистий репозиторій.** У коміт потрапляють лише зміни коду після форматування, без зайвих службових файлів.

### Порядок дій (як у викладача)

```bash
npm i -D prettier-standard                       # встановити
npx prettier-standard --format                   # відформатувати
rm -rf node_modules package.json package-lock.json   # прибрати інструмент
git add .
git commit -m "style: format code with prettier-standard"
```

### Простіший спосіб: без встановлення

`npx` сам тимчасово завантажить пакет і запустить його:

```bash
npx prettier-standard --format
```

У корені не з'являться `package.json` і `node_modules`, тож видаляти нічого не доведеться.

### Коли кореневий `package.json` залишають

Якщо форматер потрібен **постійно**:

- як скрипт `npm run format`;
- як хук перед комітом (husky + lint-staged);
- як перевірка в CI (GitHub Actions).

Для навчального проєкту вистачає разового запуску.

---

## 8. Запуск через Docker Compose: що і як перевірити

### Перевірка середовища

| Що перевірити                 | Команда / де дивитись                                              | Очікувано                       |
| ----------------------------- | ------------------------------------------------------------------ | ------------------------------- |
| Docker встановлено            | `docker --version`, `docker compose version`                       | версії без помилок              |
| Docker працює                 | `docker ps`                                                        | таблиця (можна порожню)         |
| Порти вільні                  | `ss -ltn \| grep -E ':(3000\|5000\|12345\|12346)\b'`               | порожньо                        |
| Compose-файл валідний         | `docker compose -f docker-compose-dev.yaml config --services`      | `db-dev mongo-dev server-dev front-react` |
| Назва проєкту (для контейнерів) | `docker compose -f docker-compose-dev.yaml config \| grep ^name:` | `name: exam-project-main_my`    |

### Перевірка налаштувань (dev)

| Що                                | Де дивитись                                                  | Має збігатися з                          |
| --------------------------------- | ------------------------------------------------------------ | ---------------------------------------- |
| Хост Postgres = `db-dev`          | `server/src/config/postgresConfig.json` → `development.host` | назва сервісу в `docker-compose-dev.yaml` |
| Хост Mongo = `mongo-dev`          | `server/src/config/mongoConfig.json` → `development.host`    | назва сервісу в `docker-compose-dev.yaml` |
| Логін/пароль/БД Postgres          | `postgresConfig.json` → `username/password/database`         | `db-dev.environment` у compose            |
| Порт фронтенду                    | `client/vite.config.js` → `server.port: 3000`                | `front-react.ports: '5000:3000'`          |
| Порт бекенду                      | `server/src/index.js` → `PORT \|\| 3000`                     | `server-dev.ports: '3000:3000'`           |
| Адреса API у клієнта              | `client/src/constants.js` → `localhost:3000`                 | порт бекенду на хості                     |

### Помилки в `start-dev.sh` і як їх побачити

| Проблема                                | Як перевірити                                                                 |
| --------------------------------------- | ----------------------------------------------------------------------------- |
| Назва контейнера `exam-project-server-dev-1` неправильна | після `up` виконати `docker ps --format '{{.Names}}'`: буде `exam-project-main_my-server-dev-1` |
| `up` без `-d` займає термінал           | запустити скрипт: він «зависне» на логах, міграції не стартують               |
| Немає глобальної команди `sequelize`    | `docker compose -f docker-compose-dev.yaml exec server-dev which sequelize` → порожньо; рядок `npm install -g sequelize-cli` у `server/Dockerfile` закоментовано |

**Правильний запуск** (не залежить від назви папки):

```bash
docker compose -f docker-compose-dev.yaml up -d --build
docker compose -f docker-compose-dev.yaml exec server-dev npx sequelize-cli db:migrate
docker compose -f docker-compose-dev.yaml exec server-dev npx sequelize-cli db:seed:all
```

### Перевірка, що все запустилось

```bash
docker compose -f docker-compose-dev.yaml ps                 # усі 4 сервіси у стані running/Up
docker compose -f docker-compose-dev.yaml logs -f server-dev # "Example app listening on port 3000!"
docker compose -f docker-compose-dev.yaml logs front-react   # Vite: "Local: http://localhost:3000"
```

- Фронтенд у браузері: <http://localhost:5000>
- Бекенд: <http://localhost:3000>
- Зупинити: `docker compose -f docker-compose-dev.yaml down` (з видаленням даних БД: `down -v`)

### Продакшн (`docker-compose.yaml`, `start.sh`): зараз не робочий

| Проблема                                       | Де                                                         |
| ---------------------------------------------- | ---------------------------------------------------------- |
| `--smallfiles` не підтримує Mongo 4.2+         | `docker-compose.yaml` → `mongo-prod.command`               |
| Немає скрипта `build` у server                 | `server/package.json` ↔ `server/Dockerfile-production`     |
| `build: "vite dev"` замість `vite build`; копіюється `/client/build`, а Vite пише в `dist` | `client/package.json`, `client/Dockerfile-production` |
| Postgres prod: `localhost`/`admin` ≠ `db-prod`/`password` | `postgresConfig.json` → `production` ↔ `docker-compose.yaml` |
| Стара команда `docker-compose` і контейнер `squadhelp_server-prod_1` | `start.sh`                                  |
| `FROM scratch` + `RUN` не збереться (не використовується) | кореневий `Dockerfile`                          |

Дрібниця: том `./var/www/html/images` створить у проєкті папку `var/`, її варто додати в `.gitignore`.

---

## 9. Запуск як у викладача: два термінали

`docker compose ... ps` **нічого не запускає**, а лише показує стан контейнерів. Порожня таблиця означає, що контейнери ще не створені й треба виконати `up`.

### Термінал 1: запуск і логи

```bash
docker compose -f docker-compose-dev.yaml up --build
```

Що відбувається:

1. **Pulling**: Docker завантажує образи `postgres` і `mongo` (лише під час першого запуску).
2. **Build**: збирає `server-dev` і `front-react` за їхніми `Dockerfile` (`npm install`).
3. **Запуск 4 контейнерів**: термінал залишається зайнятим логами, і це нормально.

Чекати, поки в логах з'являться рядки:

```
server-dev-1   | Example app listening on port 3000!
front-react-1  | ➜  Local:   http://localhost:3000/
```

### Термінал 2: міграції та сіди

Новий термінал відкривається кнопкою `+` на панелі терміналу VS Code.

```bash
docker compose -f docker-compose-dev.yaml ps          # 4 сервіси у стані Up
docker compose -f docker-compose-dev.yaml exec server-dev npx sequelize-cli db:migrate
docker compose -f docker-compose-dev.yaml exec server-dev npx sequelize-cli db:seed:all
```

### Перевірка в браузері

- Фронтенд: <http://localhost:5000> (у контейнері Vite слухає 3000, на хост прокинуто 5000).
- Бекенд: <http://localhost:3000>.

### Зупинка

- `Ctrl+C` у терміналі 1 зупиняє контейнери.
- `docker compose -f docker-compose-dev.yaml down` видаляє контейнери (дані БД зберігаються).
- `docker compose -f docker-compose-dev.yaml down -v` видаляє контейнери разом із томами.

### Назви контейнерів

Compose називає контейнери за назвою папки: у викладача це `copilot-project-server-dev-1`, а тут буде `exam-project-main_my-server-dev-1`. Тому команди `exec server-dev` (за назвою **сервісу**) надійніші за `docker exec <назва контейнера>`.

---

## 10. Помилка: `server-dev` падає `TypeError: Cannot read properties of undefined (reading 'prototype')`

### Симптом

```
server-dev-1 | TypeError: Cannot read properties of undefined (reading 'prototype')
server-dev-1 |     at .../node_modules/buffer-equal-constant-time/index.js:37:35
server-dev-1 | Node.js v26.13.1
server-dev-1 | [nodemon] app crashed - waiting for file changes before starting...
```

### Причина

- У `server/Dockerfile` і `client/Dockerfile` було `ARG VERSION=lts-alpine`, тобто «остання LTS». Зараз це **Node 26**.
- З Node 25 прибрали застарілий `buffer.SlowBuffer`.
- Ланцюжок `jsonwebtoken@8` → `jwa` → `buffer-equal-constant-time` звертається до `SlowBuffer.prototype`, тому сервер падає.

Висновок: тег `lts`/`latest` змінюється з часом, і старий проєкт раптом перестає працювати. **Версію Node в Docker треба фіксувати.**

### Виправлення

У `server/Dockerfile` і `client/Dockerfile`:

```dockerfile
ARG VERSION=22-alpine
```

Після цього потрібно перезібрати образи:

```bash
docker compose -f docker-compose-dev.yaml down
docker compose -f docker-compose-dev.yaml up --build
```

> `--build` обов'язковий: без нього Docker візьме старий образ з Node 26.
> Якщо помилка лишилась: `docker compose -f docker-compose-dev.yaml down -v`, потім знову `up --build`.
> `-v` скидає анонімний том `/server/node_modules`, де могли залишитись старі модулі.

### Перевірка

```bash
docker compose -f docker-compose-dev.yaml exec server-dev node -v   # v22.x
```

У логах має з'явитись `Example app listening on port 3000!`.

---

## 11. Сід на 2 користувачів: `creator` і `customer`

### Що таке сід

- **Міграція** (`db:migrate`) створює **структуру** БД: таблиці й колонки.
- **Сід** (`db:seed:all`) наповнює таблиці **початковими даними**, наприклад тестовими користувачами.
- `db:seed:all` лише **запускає** сід-файли з `server/src/seeders/`. Щоб додати нові дані, спершу потрібно **створити** новий сід-файл.

### Крок 1: створити файл сіда

```bash
docker compose -f docker-compose-dev.yaml exec server-dev npx sequelize-cli seed:generate --name users
```

У `server/src/seeders/` з'явиться заготовка `<дата-час>-users.js`. Шлях до папки береться з `server/.sequelizerc`.
Дата в назві задає **порядок запуску**: файли сортуються за назвою як рядки. Сід користувачів не залежить від `Bank` і `Select`, тож його місце в черзі неважливе.

### Крок 2: заповнити файл

Файл `server/src/seeders/20261125120000-users.js`:

```js
const bcrypt = require('bcrypt');
const CONSTANTS = require('../constants');

const PASSWORD = '123456';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const password = await bcrypt.hash(PASSWORD, CONSTANTS.SALT_ROUNDS);

    return queryInterface.bulkInsert('Users', [
      { firstName: 'Creator',  lastName: 'Test', displayName: 'creator',
        password, email: 'creator@gmail.com',  role: CONSTANTS.CREATOR },
      { firstName: 'Customer', lastName: 'Test', displayName: 'customer',
        password, email: 'customer@gmail.com', role: CONSTANTS.CUSTOMER },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users',
      { email: ['creator@gmail.com', 'customer@gmail.com'] }, {});
  },
};
```

Пояснення:

- Поля взято з моделі `server/src/models/User.js`. Обов'язкові: `firstName`, `lastName`, `displayName`, `password`, `email`, `role`.
- `role` має тип `ENUM('customer', 'creator')`, тобто **малими літерами**. Значення беруться з `constants.js` (`CREATOR`, `CUSTOMER`).
- **Пароль хешується через bcrypt**, як під час реєстрації (`middlewares/hashPassMiddle.js`). Якщо записати пароль відкритим текстом, логін не спрацює, бо `bcrypt.compare` не збіжеться.
- `avatar`, `balance`, `rating` мають значення за замовчуванням, тому їх можна не вказувати.
- `down` видаляє саме цих користувачів, щоб сід можна було відкотити.

### Крок 3: запустити

```bash
docker compose -f docker-compose-dev.yaml exec server-dev npx sequelize-cli db:seed:all
# або лише цей сід:
docker compose -f docker-compose-dev.yaml exec server-dev npx sequelize-cli db:seed --seed 20261125120000-users.js
```

Оскільки в `postgresConfig.json` вказано `"seederStorage": "sequelize"`, виконані сіди записуються в таблицю `SequelizeData`. Тому повторний `db:seed:all` **не створить дублікатів**.

### Перевірка

```bash
docker compose -f docker-compose-dev.yaml exec db-dev \
  psql -U postgres -d todo-dev -c 'SELECT id, email, role FROM "Users";'
```

Або увійти на <http://localhost:5000>:

| Роль       | Email                | Пароль   |
| ---------- | -------------------- | -------- |
| creator    | `creator@gmail.com`  | `123456` |
| customer   | `customer@gmail.com` | `123456` |

### Відкат

```bash
docker compose -f docker-compose-dev.yaml exec server-dev npx sequelize-cli db:seed:undo --seed 20261125120000-users.js
```

---

## 12. Покроково: після `up --build` → міграції → сід користувачів (вручну)

### Крок 0. Вже зроблено

```bash
docker compose -f docker-compose-dev.yaml up --build
```

Цей термінал **залишається відкритим** з логами. Далі все робиться в **другому терміналі** (`+` на панелі терміналу).

### Крок 1. Переконатися, що контейнери працюють

```bash
docker compose -f docker-compose-dev.yaml ps
```

Мають бути 4 сервіси (`db-dev`, `mongo-dev`, `server-dev`, `front-react`) зі статусом `Up`.
У логах першого терміналу має бути `Example app listening on port 3000!`.

### Крок 2. Міграції: створити таблиці

```bash
docker compose -f docker-compose-dev.yaml exec server-dev npx sequelize-cli db:migrate
```

Очікувано: по одному рядку `== ...: migrated` на кожну міграцію (`Banks`, `Selects`, `Users`, `Contests`, `Offers`, `Ratings`).

### Крок 3. Створити порожній файл сіда

```bash
docker compose -f docker-compose-dev.yaml exec server-dev npx sequelize-cli seed:generate --name users
```

- У `server/src/seeders/` з'явиться файл на зразок `20261125143015-users.js` (дата й час створення).
- Він відразу видно у VS Code, бо папка `./server` змонтована в контейнер (`volumes` у compose).
- Якщо з'являється помилка `EACCES` (немає прав), файл можна створити вручну в VS Code: `server/src/seeders/` → New File → `20261125120000-users.js`.

Заготовка виглядає так:

```js
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     */
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed commands here.
     */
  }
};
```

### Крок 4. Написати сід руками

Відкрити створений файл і писати по частинах.

**4.1. Підключити bcrypt і константи** (на початку файлу):

```js
const bcrypt = require('bcrypt');            // для хешування пароля
const CONSTANTS = require('../constants');   // ролі CREATOR/CUSTOMER і SALT_ROUNDS

const PASSWORD = '123456';                   // спільний тестовий пароль
```

> Звідки це взято: `server/src/middlewares/hashPassMiddle.js` хешує пароль під час реєстрації
> так само: `bcrypt.hash(password, CONSTANTS.SALT_ROUNDS)`.

**4.2. `up`: що додати в БД**

```js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1) хешуємо пароль (без цього логін не спрацює)
    const password = await bcrypt.hash(PASSWORD, CONSTANTS.SALT_ROUNDS);

    // 2) вставляємо 2 рядки в таблицю Users
    return queryInterface.bulkInsert(
      'Users',                       // назва таблиці (з міграції create-Users)
      [
        {
          firstName: 'Creator',
          lastName: 'Test',
          displayName: 'creator',
          password,                  // те саме, що password: password
          email: 'creator@gmail.com',
          role: CONSTANTS.CREATOR,   // 'creator'
        },
        {
          firstName: 'Customer',
          lastName: 'Test',
          displayName: 'customer',
          password,
          email: 'customer@gmail.com',
          role: CONSTANTS.CUSTOMER,  // 'customer'
        },
      ],
      {}
    );
  },
```

**4.3. `down`: як відкотити**

```js
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(
      'Users',
      { email: ['creator@gmail.com', 'customer@gmail.com'] },  // видалити лише цих двох
      {}
    );
  },
};
```

**Як визначити, які поля писати.** Відкрийте `server/src/models/User.js` або `server/src/migrations/...-create-Users.js`:

| Поле          | Обов'язкове? | Примітка                                   |
| ------------- | ------------ | ------------------------------------------ |
| `id`          | ні           | `autoIncrement`, БД ставить сама            |
| `firstName`   | **так**      | `allowNull: false`                          |
| `lastName`    | **так**      |                                            |
| `displayName` | **так**      |                                            |
| `password`    | **так**      | лише **хеш** bcrypt                         |
| `email`       | **так**      | `unique: true`, тобто не може повторюватись |
| `role`        | **так**      | `ENUM('customer', 'creator')`, малими       |
| `avatar`      | ні           | default `'anon.png'`                        |
| `balance`     | ні           | default `0`                                 |
| `rating`      | ні           | default `0`                                 |
| `accessToken` | ні           | `allowNull: true`                           |

Готовий файл у проєкті: `server/src/seeders/20261125120000-users.js` (повний текст у розділі 11).
Якщо в кроці 3 згенерувався файл з іншою датою, залиште **один** із двох, інакше буде помилка `unique` по email.

### Крок 5. Запустити сіди

```bash
docker compose -f docker-compose-dev.yaml exec server-dev npx sequelize-cli db:seed:all
```

Очікувано: `== 20261125120000-users: migrated` (а також `Bank` і `Select`).

### Крок 6. Перевірити

```bash
docker compose -f docker-compose-dev.yaml exec db-dev \
  psql -U postgres -d todo-dev -c 'SELECT id, email, role FROM "Users";'
```

Потім увійти на <http://localhost:5000> як `creator@gmail.com` / `123456` і `customer@gmail.com` / `123456`.

### Якщо щось пішло не так

| Помилка                                  | Що зробити                                                            |
| ---------------------------------------- | --------------------------------------------------------------------- |
| `relation "Users" does not exist`        | не виконано крок 2 (`db:migrate`)                                      |
| `duplicate key ... email`                | користувачі вже є: сід запускався раніше, або є 2 файли сіда           |
| `invalid input value for enum`           | роль написано не так (`CREATOR` замість `creator`)                     |
| логін не проходить                       | пароль записано без `bcrypt.hash`                                      |
| `service "server-dev" is not running`    | контейнер упав: див. логи в терміналі 1 і розділ 10                   |

---

## 13. Коли запускати `db:migrate` і `db:seed:all`

Обидві команди **обов'язкові**. Їх виконують у **другому терміналі** після `up --build`, коли в логах з'явиться `Example app listening on port 3000!`.

```bash
docker compose -f docker-compose-dev.yaml exec server-dev npx sequelize-cli db:migrate    # 1) спочатку таблиці
docker compose -f docker-compose-dev.yaml exec server-dev npx sequelize-cli db:seed:all   # 2) потім дані
```

Порядок важливий: **спочатку `db:migrate`, потім `db:seed:all`**. Без таблиць сіду нікуди записувати дані.

| Ситуація                                   | Чи потрібні migrate і seed                                                      |
| ------------------------------------------ | ------------------------------------------------------------------------------- |
| **Перший запуск** проєкту                  | **так, обидві**                                                                 |
| `Ctrl+C`, потім знову `up`                 | ні, дані зберігаються                                                           |
| `down`, потім `up`                         | **так, обидві**: у compose немає іменованого тому для Postgres, тому база порожня |
| `down -v`, потім `up --build`              | **так, обидві**: база видалена                                                  |
| Додали **нову міграцію**                   | лише `db:migrate` (виконаються тільки нові)                                     |
| Додали **новий сід**                       | лише `db:seed:all` (виконаються тільки нові)                                    |

Повторний запуск не зашкодить: Sequelize запам'ятовує, що вже виконано (таблиці `SequelizeMeta` і `SequelizeData`), і пропускає ці файли.

Як перевірити, чи є таблиці:

```bash
docker compose -f docker-compose-dev.yaml exec db-dev psql -U postgres -d todo-dev -c '\dt'
# "Did not find any relations": міграції ще не виконувались
```

---

## 14. «Опинився всередині контейнера»: `/server #` і `docker: not found`

### Що сталося

Команду не дописали до кінця:

```bash
docker compose -f docker-compose-dev.yaml exec server-dev npx
```

`npx` без аргументів відкриває **оболонку всередині контейнера**:

```
Entering npm script environment at location:
/server
Type 'exit' or ^D when finished
/server #
```

Усередині контейнера Docker не встановлений, тому `docker compose ...` дає помилку `sh: docker: not found`.

### Як розрізнити, де ви знаходитесь

| Підказка в терміналі                               | Де ви                         | Що писати                                                     |
| -------------------------------------------------- | ----------------------------- | ------------------------------------------------------------- |
| `weblettop@...:/media/.../exam-project-main_my$`   | на своєму ПК                  | повну команду `docker compose -f ... exec server-dev npx sequelize-cli ...` |
| `/server #`                                        | всередині контейнера `server-dev` | лише `npx sequelize-cli ...`                                |

### Що зробити: два варіанти

**Варіант 1: вийти й виконати повну команду на ПК**

```bash
exit            # або Ctrl+D
docker compose -f docker-compose-dev.yaml exec server-dev npx sequelize-cli db:migrate
docker compose -f docker-compose-dev.yaml exec server-dev npx sequelize-cli db:seed:all
```

**Варіант 2: виконати команди прямо в контейнері**

```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
exit
```

### Корисно знати

- `Ctrl+C` лише скасовує поточний рядок і з контейнера **не виводить**. Вийти можна командою `exit` або `Ctrl+D`.
- Зайти в контейнер навмисно: `docker compose -f docker-compose-dev.yaml exec server-dev sh`.

---

## 15. Помилка `ERROR: Validation error` під час `db:seed:all`

### Симптом

```
== 20261125185011-users: migrating =======
ERROR: Validation error
```

### Причина

`Validation error` під час `bulkInsert` найчастіше означає порушення **унікальності** (`email` має `unique: true`).

Як це сталося:

1. Спочатку існував сід `20261125120000-users.js`, і `db:seed:all` його виконав: користувачі створились, а назва файлу записалась у таблицю `SequelizeData`.
2. Потім цей файл видалили й створили свій `20261125185011-users.js` з **тими самими email**.
3. Sequelize бачить новий файл (його немає в `SequelizeData`) і пробує вставити тих самих користувачів. Email уже зайняті, тому з'являється помилка.

Видалення файлу сіда **не видаляє дані з БД** і запис у `SequelizeData`.

### Діагностика

```bash
docker compose -f docker-compose-dev.yaml exec db-dev psql -U postgres -d todo-dev \
  -c 'SELECT * FROM "SequelizeData";' \
  -c 'SELECT id, email, role FROM "Users";'
```

### Виправлення

Прибрати старих користувачів і запис про старий сід, потім запустити сіди знову:

```bash
docker compose -f docker-compose-dev.yaml exec db-dev psql -U postgres -d todo-dev \
  -c "DELETE FROM \"Users\" WHERE email IN ('creator@gmail.com','customer@gmail.com');" \
  -c "DELETE FROM \"SequelizeData\" WHERE name = '20261125120000-users.js';"

docker compose -f docker-compose-dev.yaml exec server-dev npx sequelize-cli db:seed:all
```

Очікувано: `== 20261125185011-users: migrated`.

### Як робити правильно надалі

- Щоб замінити сід, спершу **відкотіть** його, поки файл ще існує:
  ```bash
  docker compose -f docker-compose-dev.yaml exec server-dev npx sequelize-cli db:seed:undo --seed <файл>.js
  ```
  і лише потім видаляйте або змінюйте файл.
- Або почніть з чистої БД: `down -v` → `up --build` → `db:migrate` → `db:seed:all`.

---

## 16. Встановити з'єднання з Postgres

### Звідки беруться параметри

Їх видно в сервісі `db-dev` у `docker-compose-dev.yaml`:

```yaml
db-dev:
  image: postgres:15.5-bullseye
  environment:
    - POSTGRES_PASSWORD=password   # пароль
    - POSTGRES_USER=postgres       # користувач
    - POSTGRES_DB=todo-dev         # назва БД
  ports:
    - '12346:5432'                 # порт_на_ПК:порт_у_контейнері
```

`'12346:5432'` означає, що всередині контейнера Postgres слухає стандартний порт **5432**, а на вашому ПК він доступний через порт **12346**.

### Параметри підключення

| Параметр  | З ПК (VS Code, DBeaver, pgAdmin, psql) | Зсередини Docker (сервер, `postgresConfig.json`) |
| --------- | -------------------------------------- | ------------------------------------------------ |
| Host      | `localhost`                            | `db-dev` (назва сервісу)                          |
| Port      | `12346`                                | `5432`                                           |
| User      | `postgres`                             | `postgres`                                       |
| Password  | `password`                             | `password`                                       |
| Database  | `todo-dev`                             | `todo-dev`                                       |

Контейнер `db-dev` має бути запущений: `docker compose -f docker-compose-dev.yaml ps` → `Up`.

### Спосіб 1: VS Code-розширення (як у викладача, іконка зі слоном)

У викладача розширення **PostgreSQL** від Chris Kolkman (`ckolkman.vscode-postgres`), панель **POSTGRESQL EXPLORER**.

```bash
code --install-extension ckolkman.vscode-postgres
```

**Створити підключення «12346».** Натиснути іконку зі слоном → **+** вгорі панелі. Зверху по черзі з'являються поля (після кожного Enter):

| Що питає         | Що вводити                                                 |
| ---------------- | ---------------------------------------------------------- |
| hostname         | `localhost` (або `0.0.0.0`, `127.0.0.1`)                   |
| user             | `postgres`                                                 |
| password         | `password`                                                 |
| port             | `12346`                                                    |
| SSL / connection | **Standard Connection**                                    |
| database         | `todo-dev` (або *Show All Databases*, див. нижче)          |
| display name     | **`12346`**: ця назва буде видна в списку                  |

Підключення **зберігається автоматично** і залишається після перезапуску VS Code. Розгорнути: `12346` → `todo-dev` → `public` → `Users`, `Banks`, `Contests` ...

**Чому всередині `12346` є і `postgres`, і `todo-dev`.** Якщо на кроці *database* обрати *Show All Databases*, видно всі бази сервера:

- `postgres`: службова база, Postgres створює її завжди. Таблиць проєкту там немає.
- `todo-dev`: база проєкту, створена через `POSTGRES_DB: todo-dev` у `docker-compose-dev.yaml`.

Щоб бачити лише `todo-dev`: правий клік на підключенні → **Remove Connection** і створити заново, вказавши `todo-dev`.

**Корисне:**

- Запит: правий клік на базі → **New Query**, написати SQL, натиснути `F5`. Результат відкриється у вкладці `Results: unnamed-query-1`.
- Дані таблиці: правий клік на `Users` → **Select Top 1000**.
- Не підключається: `docker ps`, контейнер `db-dev` має бути `Up` з портом `0.0.0.0:12346->5432/tcp`.

### Спосіб 2: термінал через контейнер (нічого встановлювати не треба)

```bash
docker compose -f docker-compose-dev.yaml exec db-dev psql -U postgres -d todo-dev
```

Корисні команди всередині `psql`:

| Команда                         | Що робить                    |
| ------------------------------- | ---------------------------- |
| `\dt`                           | список таблиць               |
| `\d "Users"`                    | структура таблиці            |
| `SELECT id, email, role FROM "Users";` | дані                  |
| `\q`                            | вийти                        |

> Назви таблиць з великої літери пишуться **в подвійних лапках**: `"Users"`.
> Без лапок Postgres переводить назву в нижній регістр і шукає `users`.

### Спосіб 3: `psql` на ПК (якщо встановлений)

```bash
psql -h localhost -p 12346 -U postgres -d todo-dev
# пароль: password
```

### Якщо не підключається

| Помилка                              | Причина / рішення                                                  |
| ------------------------------------ | ------------------------------------------------------------------ |
| `connection refused`                 | контейнер не запущено, або вказано порт `5432` замість `12346`     |
| `password authentication failed`     | неправильний пароль або користувач (див. `environment` у compose)  |
| `database "todo-dev" does not exist` | помилка в назві БД (дефіс, не підкреслення)                         |
| `database ""todo-dev"" does not exist` | назву введено **з лапками** (`"todo-dev"`). Remove Connection і створити заново, ввести `todo-dev` без лапок |
| таблиць немає                        | не виконано `db:migrate` (розділ 13)                               |

**Як читати помилку з подвійними лапками.** Postgres сам бере назву в лапки: `database "назва" does not exist`. Якщо в лозі `""todo-dev""`, то назва, яку він отримав, вже містила лапки, тобто `"todo-dev"`. Такої бази немає. Перевірити, які бази існують насправді:

```bash
docker exec exam-project-main_my-db-dev-1 psql -U postgres -l
```

**Логи Mongo в `docker compose up` — це не помилки.** Рядки з `"s":"I"` означають Info: `Slow query`, `serverStatus was very slow` (ПК був завантажений), `Connection ended` / `Connection accepted` (nodemon перезапустив сервер). Справжня помилка позначається `"s":"E"`.

### Що вводити в розширенні (тип з'єднання Standard)

| Поле            | Значення                          |
| --------------- | --------------------------------- |
| Connection type | **Standard** (не Connection String) |
| Host            | `0.0.0.0`, `localhost` або `127.0.0.1` |
| Port            | `12346`                           |
| User            | `postgres`                        |
| Password        | `password`                        |
| Database        | `todo-dev`                        |

**Звідки `0.0.0.0`.** Його видно в `docker ps` / `docker compose ... ps` у колонці PORTS:

```
0.0.0.0:12346->5432/tcp
```

- `0.0.0.0` означає, що Docker приймає з'єднання **на всіх мережевих інтерфейсах ПК**.
- `12346->5432`: порт `12346` на ПК перенаправляється на порт `5432` у контейнері.
- Для підключення з того самого ПК підходить і `0.0.0.0`, і `localhost`, і `127.0.0.1`. На Linux вони ведуть до того самого Postgres. Найуніверсальніше писати `localhost`.

---

## 17. Панель контейнерів у VS Code (як у викладача)

У викладача зліва відкрита панель **CONTAINERS / IMAGES / REGISTRIES / NETWORKS / VOLUMES**. Її дає розширення **Container Tools** від Microsoft (`ms-azuretools.vscode-containers`, раніше воно називалося «Docker»).

> Розширення `docker.docker` (Docker DX) — **інше**. Воно додає підказки для Dockerfile/compose, але цієї панелі не показує.

### Як встановити

У терміналі:

```bash
code --install-extension ms-azuretools.vscode-containers
```

Або через Extensions (`Ctrl+Shift+X`): знайти **Container Tools** (Microsoft) і натиснути **Install**.

### Як відкрити

1. Зліва на панелі активностей з'явиться іконка контейнера (коробка). Натиснути на неї.
2. Якщо іконки немає: `Ctrl+Shift+P` і команда **View: Show Containers**.

Контейнери будуть згруповані за назвою проєкту (`exam-project-main_my`): `front-react`, `server-dev`, `db-dev`, `mongo-dev`.

### Що можна робити (правий клік по контейнеру)

| Дія            | Аналог у терміналі                                  |
| -------------- | --------------------------------------------------- |
| View Logs      | `docker logs -f <контейнер>`                        |
| Attach Shell   | `docker exec -it <контейнер> sh` (див. розділ 14)   |
| Restart / Stop | `docker restart <контейнер>` / `docker stop ...`    |
| Inspect        | `docker inspect <контейнер>`                        |

### Якщо панель порожня або з помилкою

- Docker не запущений: перевірити `docker ps`.
- Немає прав (`permission denied ... docker.sock`): користувач не в групі `docker`. Виконати `sudo usermod -aG docker $USER` і перелогінитись.

---

## 18. Вибило з програми / закрився термінал: як продовжити роботу

Закритий термінал або VS Code **не зупиняє контейнери**. Треба лише знову відкрити термінали так, як у викладача: зліва логи, справа команди.

> Назви контейнерів у цьому проєкті: `exam-project-main_my-<сервіс>-1`. У викладача замість цього `copilot-project-...`.

### Крок 0. Перейти в папку проєкту

```bash
cd /media/data419/2025/0/000finally/exam-project-main_my
```

### Крок 1. Перевірити, чи контейнери працюють

```bash
docker ps
```

- Є 4 контейнери зі статусом `Up`: переходь до кроку 2.
- Їх немає або список порожній: спочатку запусти їх:

```bash
docker compose -f docker-compose-dev.yaml up -d
```

### Крок 2. Лівий термінал: логи

```bash
docker compose -f docker-compose-dev.yaml logs -f
```

(або `docker compose -f docker-compose-dev.yaml up`: під'єднається до вже запущених контейнерів)

| Клавіша  | Що робить                                     |
| -------- | --------------------------------------------- |
| `d`      | від'єднатися від логів, контейнери працюють   |
| `Ctrl+C` | у `logs -f` просто вихід; у `up` **зупиняє** контейнери |

### Крок 3. Правий термінал: команди

Розділити термінал: кнопка **Split Terminal** або `Ctrl+Shift+5`.

```bash
# міграції
docker exec -it exam-project-main_my-server-dev-1 npx sequelize db:migrate

# сіди
docker exec -it exam-project-main_my-server-dev-1 npx sequelize db:seed:all

# зайти всередину контейнера (вихід: exit або Ctrl+D)
docker exec -it exam-project-main_my-server-dev-1 sh
```

### Шпаргалка одним блоком

```bash
cd /media/data419/2025/0/000finally/exam-project-main_my
docker ps                                                   # чи працюють
docker compose -f docker-compose-dev.yaml up -d             # якщо не працюють
docker compose -f docker-compose-dev.yaml logs -f           # логи (лівий термінал)
docker exec -it exam-project-main_my-server-dev-1 sh        # всередину (правий термінал)
```

### Якщо після перезапуску щось не так

| Ситуація                                    | Що робити                                              |
| ------------------------------------------- | ------------------------------------------------------ |
| Запрошення `/server #`, `docker: not found` | ти всередині контейнера, введи `exit` (розділ 14)      |
| `Cannot connect to the Docker daemon`       | Docker не запущений: `sudo systemctl start docker`     |
| Контейнер постійно перезапускається         | подивитися помилку: `docker logs exam-project-main_my-server-dev-1` |

---

## 19. Зупинити все і запустити заново

> Важливо: у `docker-compose-dev.yaml` для `db-dev` і `mongo-dev` **немає іменованих volumes**. Тому `docker compose down` видаляє контейнери разом із даними: Postgres і Mongo після цього будуть порожні, і треба знову виконати міграції та сіди.

### Варіант A. М'який перезапуск (дані в БД залишаються)

```bash
cd /media/data419/2025/0/000finally/exam-project-main_my
docker compose -f docker-compose-dev.yaml stop      # зупинити, контейнери не видаляються
docker compose -f docker-compose-dev.yaml start     # запустити ті самі контейнери
docker compose -f docker-compose-dev.yaml logs -f   # логи
```

Або однією командою: `docker compose -f docker-compose-dev.yaml restart`.

### Варіант B. Повністю з нуля (БД порожні, пересборка образів)

```bash
cd /media/data419/2025/0/000finally/exam-project-main_my

# 1. зупинити і видалити контейнери, мережу та їхні volumes (дані БД!)
docker compose -f docker-compose-dev.yaml down -v --remove-orphans

# 2. перезібрати образи і запустити у фоні (-V: нові node_modules з образу)
docker compose -f docker-compose-dev.yaml up -d --build -V

# 3. перевірити, що всі 4 контейнери Up
docker ps

# 4. дочекатися, поки Postgres прийме з'єднання
docker exec exam-project-main_my-db-dev-1 pg_isready -U postgres

# 5. створити таблиці і заповнити даними
docker exec -it exam-project-main_my-server-dev-1 npx sequelize db:migrate
docker exec -it exam-project-main_my-server-dev-1 npx sequelize db:seed:all

# 6. логи (лівий термінал)
docker compose -f docker-compose-dev.yaml logs -f
```

### Яку команду обрати

| Ситуація                                          | Команда                               |
| ------------------------------------------------- | ------------------------------------- |
| Щось зависло, дані потрібні                       | Варіант A (`restart`)                 |
| Змінив `package.json` або `Dockerfile`            | `up -d --build -V` (без `down -v`)    |
| `Validation error` у сідах, хочу чисту БД         | Варіант B                             |
| Змінив `docker-compose-dev.yaml`                  | `up -d` (compose сам перестворить)    |

### Корисно знати

- `stop` / `start`: контейнери ті самі, дані на місці.
- `down`: контейнери видаляються. Без іменованих volumes дані БД теж пропадають.
- `down -v`: додатково видаляє volumes, на диску не лишається «сміття».
- Після варіанта B в PostgreSQL Explorer підключення `12346` залишиться. Достатньо натиснути **Refresh**.
