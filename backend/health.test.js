const request = require('supertest');
const express = require('express');

const app = express();
app.use(express.json());

// Basit bir health endpoint'i (örnek)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

describe('API Health Check', () => {
  it('should return status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('ok');
  });
});
