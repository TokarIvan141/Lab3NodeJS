const request = require('supertest');
const app = require('../app');
const db = require('../config/db.config');

jest.mock('../config/db.config', () => ({
    query: jest.fn()
}));

describe('Book REST API Layered Architecture Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('GET /api/books returns 200', async () => {
        db.query.mockResolvedValue([[{ id: 1, title: 'Test Book' }]]);
        const response = await request(app).get('/api/books');

        expect(response.status).toBe(200);
        expect(response.headers).toHaveProperty('x-response-time');
    });

    test('GET /api/books returns 500 on Database Error', async () => {
        db.query.mockRejectedValue(new Error('Connection Failed'));
        const response = await request(app).get('/api/books');

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('error');
    });

    test('GET /api/books/:id returns 200', async () => {
        db.query.mockResolvedValue([[{ id: 1, title: 'Test Book' }]]);
        const response = await request(app).get('/api/books/1');

        expect(response.status).toBe(200);
    });

    test('GET /api/books/:id returns 404 if book does not exist', async () => {
        db.query.mockResolvedValue([[]]);
        const response = await request(app).get('/api/books/999');

        expect(response.status).toBe(404);
    });

    test('POST /api/books returns 201', async () => {
        db.query.mockResolvedValue([{ insertId: 1 }]);
        const response = await request(app).post('/api/books').send({ title: 'New Book' });

        expect(response.status).toBe(201);
        expect(response.body.id).toBe(1);
    });

    test('POST /api/books returns 500 on creation error', async () => {
        db.query.mockRejectedValue(new Error('DB Insert Error'));
        const response = await request(app).post('/api/books').send({});

        expect(response.status).toBe(500);
    });

    test('DELETE /api/books/:id returns 200', async () => {
        db.query.mockResolvedValue([{ affectedRows: 1 }]);
        const response = await request(app).delete('/api/books/1');

        expect(response.status).toBe(200);
    });

    test('DELETE /api/books/:id returns 404 if not found', async () => {
        db.query.mockResolvedValue([{ affectedRows: 0 }]);
        const response = await request(app).delete('/api/books/999');

        expect(response.status).toBe(404);
    });

    test('Rate Limiter returns 429 after 50 requests', async () => {
        db.query.mockResolvedValue([[{ id: 1 }]]);

        for (let i = 0; i < 50; i++) {
            await request(app).get('/api/books');
        }

        const response = await request(app).get('/api/books');
        expect(response.status).toBe(429);
        expect(response.body.error).toBe('Too Many Requests');
    });
});