const { login } = require('./src/controllers/authController');
const { env } = require('./src/config/env');
const jwt = require('jsonwebtoken');

const req = {
  validated: { body: { email: 'admin@admin.com', password: 'password123' } },
  ip: '127.0.0.1',
  headers: { 'user-agent': 'test' }
};

const res = {
  status: (code) => {
    return {
      json: (data) => {
        if (data.data && data.data.token) {
          const decoded = jwt.decode(data.data.token);
          console.log('Decoded Token:', decoded);
          console.log('Current time:', Math.floor(Date.now() / 1000));
          console.log('Expires in (seconds):', decoded.exp - Math.floor(Date.now() / 1000));
        } else {
          console.log('Response:', code, data);
        }
      }
    };
  },
  cookie: () => {}
};

// Mocking required dependencies for login might be hard, so let's just make a real request to the running backend.
