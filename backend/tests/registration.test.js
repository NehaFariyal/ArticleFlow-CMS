const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const request = require('supertest');

process.env.JWT_SECRET ||= crypto.randomBytes(32).toString('hex');

const app = require('../server');
const userStore = require('../models/userStore');

describe('Reader and Author registration', () => {
  const password = 'StrongPass123!';
  const registrations = [
    { role: 'reader', name: 'Registration Reader' },
    { role: 'author', name: 'Registration Author' },
  ];

  it.each(registrations)('registers and signs in a $role account', async ({ role, name }) => {
    const email = `${role}-${crypto.randomUUID()}@example.test`;
    const registration = await request(app)
      .post('/api/auth/register')
      .send({ name, email, password, role, bio: 'Test profile' });

    expect(registration.statusCode).toBe(201);
    expect(registration.body.success).toBe(true);
    expect(registration.body.user).toMatchObject({ name, email, role });
    expect(registration.body.token).toBeTruthy();

    const storedUser = await userStore.findByEmail(email, true);
    expect(storedUser).toBeTruthy();
    expect(storedUser.password).not.toBe(password);
    expect(await bcrypt.compare(password, storedUser.password)).toBe(true);

    const login = await request(app)
      .post('/api/auth/login')
      .send({ email, password });

    expect(login.statusCode).toBe(200);
    expect(login.body.success).toBe(true);
    expect(login.body.user.role).toBe(role);
    expect(login.body.token).toBeTruthy();
  });
});
