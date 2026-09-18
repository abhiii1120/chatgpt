import request from 'supertest';
import { app } from '../../app/app.js';
import {clearTestDB,connectTestDB,disconnectTestDB} from '../setup.js';

/**
 * Runs once before any test in this file
 * starts mongodb instance and connects mongoose to it.
 */
beforeAll(async () => {
    await connectTestDB();
});

/**
 * Runs after every individual test
 * wipes all collections so the next test starts with a clean empty database.
 */
afterEach(async () => {
    await  clearTestDB();
})

/**
 * Runs once after all tests in this file finish
 * disconnects and stops the in-memory mongoDB instance
 */
afterAll(async () => {
    await disconnectTestDB();
})

describe('Testing register api', () => {
    test('Should register the user',async() => {
        const res = await request(app).post('/api/v1/auth/register').send({
            name:'testuser',
            email:'testuser@example.com',
            password:'password123',
        });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('message',"Registered Successfully");
    });

    test('Should reject existing user', async() => {
        await request(app).post('/api/v1/auth/register').send({
            name:'testuser',
            email:'testuser@example.com',
            password:'password123'
        });

        const res = await request(app).post('/api/v1/auth/register').send({
            name:'testuser',
            email:'testuser@example.com',
            password:'password123'
        });

        expect(res.statusCode).toBe(409);
    })

    test('Should reject empty values', async () => {
        let res = await request(app).post('/api/v1/auth/register').send({
            name:'',
            email:'testuser@example.com',
            password:'password123'
        });

        expect(res.statusCode).toBe(400);
    })
})