import http from 'http';

const baseURL = 'http://localhost:3000';

function makeRequest(method, path, data = null, cookie = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseURL);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (cookie) {
      options.headers['Cookie'] = cookie;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const cookies = res.headers['set-cookie'];
          resolve({ 
            status: res.statusCode, 
            data: JSON.parse(body),
            cookies 
          });
        } catch {
          resolve({ status: res.statusCode, data: body, cookies: res.headers['set-cookie'] });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function runTests() {
  console.log('=== Тестування API ===\n');

  try {
    console.log('1. Реєстрація користувача...');
    const registerResult = await makeRequest('POST', '/auth/register', {
      username: 'testuser',
      password: 'password123'
    });
    console.log('Статус:', registerResult.status);
    console.log('Відповідь:', registerResult.data);
    console.log();

    console.log('2. Вхід користувача...');
    const loginResult = await makeRequest('POST', '/auth/login', {
      username: 'testuser',
      password: 'password123'
    });
    console.log('Статус:', loginResult.status);
    console.log('Відповідь:', loginResult.data);
    
    let sessionCookie = null;
    if (loginResult.cookies && loginResult.cookies[0]) {
      const cookieString = loginResult.cookies[0];
      sessionCookie = cookieString.split(';')[0];
    }
    console.log('Cookie (повний):', loginResult.cookies ? loginResult.cookies[0] : null);
    console.log('Cookie (відправляємо):', sessionCookie);
    console.log();

    console.log('3. Отримання інформації про користувача...');
    console.log('Відправляємо cookie:', sessionCookie);
    const infoResult = await makeRequest('GET', '/auth/info', null, sessionCookie);
    console.log('Статус:', infoResult.status);
    console.log('Відповідь:', infoResult.data);
    console.log();

    console.log('4. Створення ресурсу (потребує автентифікації)...');
    const createResult = await makeRequest('POST', '/resources', {}, sessionCookie);
    console.log('Статус:', createResult.status);
    console.log('Відповідь:', createResult.data);
    console.log();

    console.log('5. Спроба доступу до захищеного ресурсу без автентифікації...');
    const unauthorizedResult = await makeRequest('POST', '/resources', {});
    console.log('Статус:', unauthorizedResult.status);
    console.log('Відповідь:', unauthorizedResult.data);
    console.log();

    console.log('6. Вихід користувача...');
    const logoutResult = await makeRequest('POST', '/auth/logout', {}, sessionCookie);
    console.log('Статус:', logoutResult.status);
    console.log('Відповідь:', logoutResult.data);
    console.log();

    console.log('7. Спроба доступу після виходу...');
    const afterLogoutResult = await makeRequest('GET', '/auth/info', null, sessionCookie);
    console.log('Статус:', afterLogoutResult.status);
    console.log('Відповідь:', afterLogoutResult.data);
    console.log();

    console.log('=== Тестування завершено ===');

  } catch (error) {
    console.error('Помилка:', error.message);
    console.log('\nПереконайтеся, що сервер запущено: npm start');
  }
}

runTests();
