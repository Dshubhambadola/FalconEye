// __tests__/rule-alert.controller.test.ts
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app';
import { connectDB } from '../src/config/db';
import { beforeAll, afterAll, describe, it, expect } from '@jest/globals';

let mongo: MongoMemoryServer;

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

describe('Rule and Alert API', () => {
  it('should create and retrieve rules', async () => {
    const rule = {
      appId: 'myApp',
      name: 'Too many logins',
      eventType: 'login',
      field: 'userId',
      condition: { max: 2, windowSeconds: 60 },
      enabled: true
    };

    const createRes = await request(app)
      .post('/api/rules')
      .send(rule);

    expect(createRes.status).toBe(201);
    expect(createRes.body).toHaveProperty('_id');

    const getRes = await request(app).get('/api/rules');
    expect(getRes.status).toBe(200);
    expect(getRes.body.length).toBeGreaterThan(0);
  });

  it('should return alerts after rule violation', async () => {
    const event = {
      appId: 'myApp',
      userId: 'u123',
      type: 'login',
      payload: {},
      timestamp: new Date().toISOString()
    };

    await request(app).post('/api/events').send(event);
    await request(app).post('/api/events').send(event);
    await request(app).post('/api/events').send(event); // triggers alert

    const alerts = await request(app).get('/api/alerts');
    expect(alerts.status).toBe(200);
    expect(alerts.body.length).toBeGreaterThan(0);
  });

  it('should not trigger alerts for disabled rule', async () => {
    await request(app).post('/api/rules').send({
      appId: 'testApp',
      name: 'disabled rule',
      eventType: 'login',
      field: 'userId',
      condition: { max: 1, windowSeconds: 30 },
      enabled: false
    });

    const event = {
      appId: 'testApp',
      userId: 'disabledUser',
      type: 'login',
      payload: {},
      timestamp: new Date().toISOString()
    };

    await request(app).post('/api/events').send(event);
    await request(app).post('/api/events').send(event);

    const alerts = await request(app).get('/api/alerts');
    const match = alerts.body.filter((a: any) => a.userId === 'disabledUser');
    expect(match.length).toBe(0);
  });

  it('should ignore malformed rules missing condition', async () => {
    await request(app).post('/api/rules').send({
      appId: 'brokenApp',
      name: 'missing condition',
      eventType: 'login',
      field: 'userId',
      enabled: true
    });

    const event = {
      appId: 'brokenApp',
      userId: 'badUser',
      type: 'login',
      payload: {},
      timestamp: new Date().toISOString()
    };

    await request(app).post('/api/events').send(event);
    await request(app).post('/api/events').send(event);

    const alerts = await request(app).get('/api/alerts');
    const match = alerts.body.filter((a: any) => a.userId === 'badUser');
    expect(match.length).toBe(0);
  });
});
