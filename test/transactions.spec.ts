import { it, expect, beforeAll, afterAll, describe, expect } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a new transaction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 400,
        type: 'credit',
      })
      .expect(201)
  })

  it('should be able to list the transactions', async () => {
    const createTransactionresponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 400,
        type: 'credit',
      })

    const cookie = createTransactionresponse.get('Set-Cookie')
    const listTransactionResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookie)
      .expect(200)

    expect(listTransactionResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'New transaction',
        amount: 400,
      }),
    ])
  })
})
