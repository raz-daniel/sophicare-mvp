import { StatusCodes } from 'http-status-codes';

export interface IError extends Error {
  statusCode: StatusCodes;
  code?: string;
  details?: any;
}