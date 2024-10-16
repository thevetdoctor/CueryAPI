import express, { Request, Response } from 'express';
import logger from '../logger';
import { Record } from '../models/record';
import { Transaction } from '../models/transaction';
import { EDITags } from '../types';
import {
  checkForRequiredFields,
  extractEDITags,
  parseTransactionString,
  removeSpaces,
  validateSegments,
} from '../utils';
import { HttpStatus } from '../utils/httpStatus';

const router = express.Router();

interface CreateTransactionRequest extends Request {
  body: {
    transaction: string;
  };
}

interface GetTransactionQuery extends Request {
  query: {
    subscriber_id: string;
    service_type: string;
  };
}

router.post('/parse', async (req: CreateTransactionRequest, res: Response) => {
  const { transaction } = req.body;
  try {
    const trimmed = removeSpaces(transaction);
    const ediTags = extractEDITags(trimmed);
    const requiredFields = Object.values(EDITags);
    validateSegments(trimmed);
    checkForRequiredFields(requiredFields, ediTags);
    const parsed = parseTransactionString(trimmed);

    await Transaction.create({ transaction: trimmed });
    res.json({
      status: HttpStatus.OK,
      message: 'Transaction parsed and stored successfully',
    });
  } catch (error: any) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ success: false, error: error.message });
  }
});

router.get('/query', async (req: GetTransactionQuery, res: Response) => {
  const { subscriber_id, service_type } = req.query;
  // subscriber_id=11122333301&service_type=30
  // { "subscriber_name": "DOE JOHN", "plan_name": "GOLD PLAN", "eligibility_date": "2020-01-01" }
  try {
    const transactions = await Transaction.findAll({
      raw: true,
    });
    const records = await Record.findOne({
      where: {
        subscriber_id,
        service_type,
      },
      attributes: ['subscriber_name', 'plan_name', 'eligibility_date'],
      raw: true,
    });
    res.json({
      status: HttpStatus.OK,
      data: records,
      message: 'User data retrieved',
    });
  } catch (error: any) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ success: false, error: error.message });
  }
});

export default router;
