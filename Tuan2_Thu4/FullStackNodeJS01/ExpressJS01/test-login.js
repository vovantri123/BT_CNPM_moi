const http = require('http');

const loginData = JSON.stringify({
  email: 'user1@gmail.com',
  password: '12345678',
});

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/v1/api/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(loginData),
  },
};

console.log('Testing login API...');
console.log('Data:', loginData);

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log('Headers:', res.headers);

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      console.log('Response:', JSON.parse(data));
    } catch (e) {
      console.log('Response (raw):', data);
    }
  });
});

req.on('error', (error) => {
  console.error('Request Error:', error.message);
});

req.write(loginData);
req.end();
