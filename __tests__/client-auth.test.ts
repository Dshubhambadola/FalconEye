import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app';
import { connectDB } from '../src/config/db';
import { beforeAll, afterAll, describe, it, expect } from '@jest/globals';

let mongo: MongoMemoryServer;
let apiKey: string;
let adminKey: string;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongo.getUri();
  await connectDB();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (mongo) await mongo.stop();
});

describe('Client Auth Flow', () => {
  it('should create a new client and return an API key', async () => {
    const res = await request(app).post('/api/clients').send({
      name: 'TestClient',
      appId: 'testApp1',
      role: 'client'
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('apiKey');
    apiKey = res.body.apiKey;
  });

  it('should create a new admin and return an API key', async () => {
    const res = await request(app).post('/api/clients').send({
      name: 'AdminUser',
      appId: 'adminApp',
      role: 'admin'
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('apiKey');
    adminKey = res.body.apiKey;
  });

  it('should reject requests without a valid API key', async () => {
    const res = await request(app).post('/api/events').send({});
    expect(res.status).toBe(401);
  });

  it('should accept requests with a valid client API key', async () => {
    const res = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${apiKey}`)
      .send({
        appId: 'testApp1',
        userId: 'authUser',
        type: 'login',
        payload: {},
        timestamp: new Date().toISOString()
      });

    expect(res.status).toBe(201);
  });

  it('should reject access for inactive clients', async () => {
    const createRes = await request(app).post('/api/clients').send({
      name: 'InactiveClient',
      appId: 'inactiveApp',
      role: 'client'
    });

    const inactiveKey = createRes.body.apiKey;

    await mongoose.connection.collection('clients').updateOne(
      { apiKey: inactiveKey },
      { $set: { active: false } }
    );

    const res = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${inactiveKey}`)
      .send({
        appId: 'inactiveApp',
        userId: 'blockedUser',
        type: 'login',
        payload: {},
        timestamp: new Date().toISOString()
      });

    expect(res.status).toBe(403);
  });

  it('should allow admin to access admin-only routes', async () => {
    const res = await request(app)
      .get('/api/rules')
      .set('Authorization', `Bearer ${adminKey}`);

    expect(res.status).toBe(200);
  });

  it('should block client from accessing admin-only routes', async () => {
    const res = await request(app)
      .get('/api/rules')
      .set('Authorization', `Bearer ${apiKey}`);

    expect(res.status).toBe(403);
  });
});