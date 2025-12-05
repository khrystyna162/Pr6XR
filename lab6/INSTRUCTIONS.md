# Інструкція по запуску та тестуванню Lab 6

## Крок 1: Встановлення залежностей

```bash
npm install
```

## Крок 2: Запуск сервера

### Варіант 1: Звичайний запуск
```bash
npm start
```

### Варіант 2: Режим розробки (з автоперезапуском)
```bash
npm run dev
```

Сервер запуститься на порту 3000.

Перевірте в консолі повідомлення:
```
Server is running on http://localhost:3000
Swagger docs available at http://localhost:3000/docs
```

## Крок 3: Перевірка роботи сервера

### В браузері:
Відкрийте: http://localhost:3000/

Ви маєте побачити:
```json
{"message":"Lab 6 - Authentication API"}
```

### Swagger документація:
http://localhost:3000/docs

## Крок 4: Тестування через автоматичний скрипт

В **НОВОМУ** терміналі (сервер має працювати):

```bash
node test-api.js
```

Ви побачите результати всіх тестів:
- Реєстрація користувача
- Вхід в систему
- Отримання інформації про користувача
- Створення захищеного ресурсу
- Спроба доступу без автентифікації
- Вихід з системи
- Спроба доступу після виходу

## Крок 5: Ручне тестування через Postman/Insomnia

### 1. Реєстрація користувача

**Request:**
```
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "username": "student",
  "password": "mypassword123"
}
```

**Expected Response (201):**
```json
{
  "id": 1,
  "username": "student",
  "createdAt": "2025-11-24T07:00:00.000Z"
}
```

### 2. Вхід користувача

**Request:**
```
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "username": "student",
  "password": "mypassword123"
}
```

**Expected Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "student"
  }
}
```

**ВАЖЛИВО:** Збережіть cookie `sessionId` з відповіді!

В Postman:
- Перейдіть на вкладку "Cookies"
- Скопіюйте значення `sessionId`

В Insomnia:
- Cookie автоматично зберігаються

### 3. Отримання інформації про користувача (ЗАХИЩЕНО)

**Request:**
```
GET http://localhost:3000/auth/info
Cookie: sessionId=<ваше_значення>
```

**Expected Response (200):**
```json
{
  "id": 1,
  "username": "student",
  "createdAt": "2025-11-24T07:00:00.000Z"
}
```

### 4. Спроба створити ресурс БЕЗ автентифікації

**Request:**
```
POST http://localhost:3000/resources
Content-Type: application/json

{}
```

**Expected Response (401):**
```json
{
  "error": "Unauthorized"
}
```

### 5. Створення ресурсу З автентифікацією

**Request:**
```
POST http://localhost:3000/resources
Cookie: sessionId=<ваше_значення>
Content-Type: application/json

{}
```

**Expected Response (200):**
```json
{
  "message": "Resource created by user",
  "userId": 1,
  "username": "student"
}
```

### 6. Оновлення ресурсу (ЗАХИЩЕНО)

**Request:**
```
PUT http://localhost:3000/resources/123
Cookie: sessionId=<ваше_значення>
Content-Type: application/json

{}
```

**Expected Response (200):**
```json
{
  "message": "Resource 123 updated by user",
  "userId": 1,
  "username": "student"
}
```

### 7. Видалення ресурсу (ЗАХИЩЕНО)

**Request:**
```
DELETE http://localhost:3000/resources/123
Cookie: sessionId=<ваше_значення>
```

**Expected Response (200):**
```json
{
  "message": "Resource 123 deleted by user",
  "userId": 1,
  "username": "student"
}
```

### 8. Перегляд ресурсів (ПУБЛІЧНО)

**Request:**
```
GET http://localhost:3000/resources
```

**Expected Response (200):**
```json
{
  "message": "Public resource list",
  "resources": ["item1", "item2", "item3"]
}
```

### 9. Вихід користувача

**Request:**
```
POST http://localhost:3000/auth/logout
Cookie: sessionId=<ваше_значення>
```

**Expected Response (200):**
```json
{
  "message": "Logout successful"
}
```

Cookie має бути очищено.

### 10. Спроба доступу після виходу

**Request:**
```
GET http://localhost:3000/auth/info
Cookie: sessionId=<старе_значення>
```

**Expected Response (401):**
```json
{
  "error": "Session expired or invalid"
}
```

## Крок 6: Тестування валідації

### Спроба реєстрації з коротким паролем

**Request:**
```
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "username": "test",
  "password": "123"
}
```

**Expected Response (400):**
```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "body/password must NOT have fewer than 6 characters"
}
```

### Спроба реєстрації з коротким username

**Request:**
```
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "username": "ab",
  "password": "password123"
}
```

**Expected Response (400):**
```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "body/username must NOT have fewer than 3 characters"
}
```

### Спроба реєстрації існуючого користувача

Спочатку створіть користувача, потім спробуйте створити ще раз з тим самим username.

**Expected Response (400):**
```json
{
  "error": "Username already exists"
}
```

### Спроба входу з неправильним паролем

**Request:**
```
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "username": "student",
  "password": "wrongpassword"
}
```

**Expected Response (401):**
```json
{
  "error": "Invalid credentials"
}
```

## Крок 7: Перевірка Basic Auth для Nginx (опціонально)

Якщо ви налаштували Nginx:

1. Згенеруйте .htpasswd:
```bash
node generate-htpasswd.js
```

2. Налаштуйте Nginx згідно з `nginx.conf`

3. Спробуйте відкрити документацію:
```
http://localhost/docs
```

Браузер запитає:
- Username: `admin`
- Password: `admin123`

## Скріншоти для звіту

Зробіть скріншоти наступних запитів:

1. ✅ Успішна реєстрація користувача (201)
2. ✅ Успішний вхід з отриманням cookie (200)
3. ✅ Отримання інформації про користувача (200)
4. ✅ Створення ресурсу з автентифікацією (200)
5. ❌ Спроба створення ресурсу без автентифікації (401)
6. ✅ Успішний вихід (200)
7. ❌ Спроба доступу після виходу (401)
8. ❌ Валідація - короткий пароль (400)
9. 📊 Swagger документація

## Troubleshooting

### Сервер не запускається
- Перевірте, чи порт 3000 вільний
- Перевірте, чи встановлені всі залежності: `npm install`

### Cookie не зберігаються
- В Postman: вимкніть "Automatically follow redirects"
- В Insomnia: перевірте налаштування Cookies
- Переконайтеся, що використовуєте http://localhost:3000, а не 127.0.0.1

### 401 Unauthorized на захищених роутах
- Переконайтеся, що ви спочатку виконали login
- Перевірте, що cookie sessionId передається
- Перевірте термін дії сесії (24 години)

### Помилка валідації
- Переконайтеся, що Content-Type: application/json
- Перевірте формат JSON
- Перевірте мінімальні довжини: username >= 3, password >= 6

## Додаткові команди

### Зупинити сервер
Натисніть `Ctrl+C` в терміналі де запущено сервер

### Очистити node_modules та переінсталювати
```bash
rmdir /s /q node_modules
npm install
```

### Перевірити версію Node.js
```bash
node --version
```

Рекомендована версія: Node.js 18.x або новіше
