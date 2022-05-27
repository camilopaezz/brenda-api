import request from 'supertest'
import { config } from 'dotenv'

import { connectDB } from '../db'
import { app } from '../server'

config()

beforeAll(() => {
  app.listen(3000, async () => {
    await connectDB()
  })
})

describe('Report', () => {
  it('should return all reports', async () => {
    const response = await request(app).get('/report')
    expect(response.status).toBe(200)
    expect(response.body.error).toBeNull()
    expect(response.body.reports).toBeTruthy()
  })
})
