import request from "supertest";
import { app } from "../../app/app.js";
import {clearTestDB,connectTestDB,disconnectTestDB} from "../setup.js";

beforeAll(async() => {
    await connectTestDB();
})


afterEach(async() => {
    await clearTestDB();
})

afterAll(async() => {
    await disconnectTestDB();
})

describe('test login api',() => {
    test('should login the user',async () => {
        await request(app).post('/api/v1/auth/register').send({
            name:'testuser',
            email:'testuser@gmail.com',
            password:'123123123',
        })

        let res = await request(app).post('/api/v1/auth/login').send({
            email:'testuser@gmail.com',
            password:'123123123'
        })

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('accessToken');
    });

    test('should reject wrong password',async () => {
         await request(app).post('/api/v1/auth/register').send({
            name:'testuser',
            email:'testuser@gmail.com',
            password:'123123123',
        })

        let res = await request(app).post('/api/v1/auth/login').send({
            email:'testuser@gmail.com',
            password:'123123'
        })

        expect(res.statusCode).toBe(401);
    });
})