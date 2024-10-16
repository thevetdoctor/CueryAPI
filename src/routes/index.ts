import express, { Request, Response, NextFunction } from 'express';
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
import { HttpError } from '../utils/httpError';
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

router.post(
  '/parse',
  async (req: CreateTransactionRequest, res: Response, next: NextFunction) => {
    const { transaction } = req.body;
    try {
      const trimmed = removeSpaces(transaction);
      const ediTags = extractEDITags(trimmed);
      const requiredFields = Object.values(EDITags);
      validateSegments(trimmed);
      checkForRequiredFields(requiredFields, ediTags);
      const parsed = parseTransactionString(trimmed);

      // Extracting the required fields
      const subscriber_id = parsed?.TRN.element02;
      const service_type = parsed?.HL[0].element03;

      const subscriber_name = parsed?.NM1.find(
        item => item.element01 === 'IL'
      )?.element03;
      const plan_name = parsed?.NM1.find(
        item => item.element01 === '1P'
      )?.element03;
      const eligibility_date = parsed?.DTP.element03;

      const transactionExist = await Transaction.findOne({
        where: {
          transaction: trimmed,
        },
      });
      if (transactionExist) {
        throw new HttpError(
          HttpStatus.BAD_REQUEST,
          'Transaction already parsed'
        );
      }
      await Transaction.create({ transaction: trimmed });
      await Record.create({
        subscriber_id,
        subscriber_name,
        plan_name,
        eligibility_date,
        service_type,
      });

      logger.info('Transaction parsed and stored successfully');
      res.json({
        status: HttpStatus.OK,
        message: 'Transaction parsed and stored successfully',
      });
    } catch (error: any) {
      next(error);
    }
  }
);

router.get(
  '/query',
  async (req: GetTransactionQuery, res: Response, next: NextFunction) => {
    const { subscriber_id, service_type } = req.query;
    try {
      const record = await Record.findOne({
        where: {
          subscriber_id,
          service_type,
        },
        attributes: ['subscriber_name', 'plan_name', 'eligibility_date'],
        raw: true,
      });

      if (!record) {
        throw new HttpError(HttpStatus.NOT_FOUND, 'Record not found');
      }
      logger.info('Transaction parsed and stored successfully');
      res.json({
        status: HttpStatus.OK,
        data: record,
        message: 'User data retrieved',
      });
    } catch (error: any) {
      next(error);
    }
  }
);

export default router;
