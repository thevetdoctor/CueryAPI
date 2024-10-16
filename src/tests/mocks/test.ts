import request from 'supertest';
import express from 'express';
import router from '../../routes';
import { HttpStatus } from '../../utils/httpStatus';
import { Transaction } from '../../models/transaction';
import { Record } from '../../models/record';
import app from '../../server';
import sequelize from '../../config/database';
import { removeSpaces } from '../../utils';
import { sample1, sample2, sample4 } from '../../sample';

app.use(express.json());
app.use('/', router);

beforeAll(async () => {
  await sequelize.sync();
});

afterAll(async () => {
  await sequelize.close();
});

describe('POST /parse', () => {
  it('should parse and store the transaction successfully', async () => {
    const mockTransaction = removeSpaces(sample1);

    jest
      .spyOn(Transaction, 'create')
      .mockResolvedValue({ transaction: mockTransaction } as any);

    const response = await request(app)
      .post('/parse')
      .send({ transaction: mockTransaction });

    expect(Transaction.create).toHaveBeenCalledWith({
      transaction: mockTransaction,
    });
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body.message).toBe(
      'Transaction parsed and stored successfully'
    );
  });

  it('should return an error if validation fails', async () => {
    const invalidTransaction = removeSpaces(sample4);

    jest
      .spyOn(Transaction, 'create')
      .mockResolvedValue({ transaction: invalidTransaction } as any);

    const response = await request(app)
      .post('/parse')
      .send({ transaction: invalidTransaction });

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
  });

  it('should return an error if transaction is already submitted and parsed', async () => {
    const mockTransaction = removeSpaces(sample1);

    jest
      .spyOn(Transaction, 'findOne')
      .mockResolvedValue({ transaction: mockTransaction } as any);

    await request(app).post('/parse').send({ transaction: mockTransaction });
    const response = await request(app)
      .post('/parse')
      .send({ transaction: mockTransaction });
    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
  });
});

describe('GET /query', () => {
  it('should return user data if record exists', async () => {
    const mockTransaction = removeSpaces(sample2);

    const mockRecord = {
      subscriber_name: 'DOE',
      plan_name: 'PROVIDER',
      eligibility_date: '20200101',
    };

    jest.spyOn(Record, 'findOne').mockResolvedValue(mockRecord as any);

    await request(app).post('/parse').send({ transaction: mockTransaction });

    const response = await request(app).get(
      '/query?subscriber_id=93175-012547&service_type=20'
    );
    expect(Record.findOne).toHaveBeenCalled();
    expect(response.status).toBe(HttpStatus.OK);
    expect(JSON.parse(response.text).data).toEqual(mockRecord);
  });

  it('should return 404 if record is not found', async () => {
    jest.spyOn(Record, 'findOne').mockResolvedValue(null);

    const response = await request(app).get(
      '/query?subscriber_id=11122333301&service_type=30'
    );

    expect(Record.findOne).toHaveBeenCalled();
    expect(response.status).toBe(HttpStatus.NOT_FOUND);
    expect(JSON.parse(response.text).message).toBe('Record not found');
  });
});
