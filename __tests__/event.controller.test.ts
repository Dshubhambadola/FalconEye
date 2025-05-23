// __tests__/event.controller.test.ts
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app';
import { connectDB } from '../src/config/db';
import { EventService } from '../src/modules/event/application/event.service';
import { EventEntity } from '../src/modules/event/domain/event.entity';
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

describe('POST /api/events', () => {
  it('should store a valid event and return 201', async () => {
    const event = {
      appId: 'testApp',
      userId: 'user123',
      type: 'login',
      payload: { ip: '127.0.0.1' },
      timestamp: new Date().toISOString()
    };

    const res = await request(app)
      .post('/api/events')
      .send(event);

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ message: 'Event received' });
  });

  it('should return 400 for missing fields', async () => {
    const event = {
      appId: 'testApp',
      // userId missing
      type: 'login',
      timestamp: new Date().toISOString()
    };

    const res = await request(app)
      .post('/api/events')
      .send(event);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
  });
});

describe('EventService', () => {
  it('should create an event using the service', async () => {
    const event: EventEntity = {
      appId: 'serviceApp',
      userId: 'serviceUser',
      type: 'purchase',
      payload: { amount: 500 },
      timestamp: new Date(),
    };

    const result = await EventService.createEvent(event);

    expect(result).toHaveProperty('_id');
    expect(result).toMatchObject({
      appId: 'serviceApp',
      userId: 'serviceUser',
      type: 'purchase'
    });
  });
});
