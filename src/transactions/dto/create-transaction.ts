import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { requestMessages } from 'src/libs/common';
import {
  TransactionCurrency,
  TransactionStatus,
} from '../models/transaction.model';

export class CreateTransactionDto {
  @IsNotEmpty({ message: requestMessages.isNotEmpty('userId') })
  @IsString({ message: requestMessages.isString('userId') })
  userId: string;

  @IsNotEmpty({ message: requestMessages.isNotEmpty('currency') })
  @IsEnum(TransactionCurrency, {
    message: requestMessages.isEnum('currency', TransactionCurrency),
  })
  currency: TransactionCurrency;

  @IsNotEmpty({ message: requestMessages.isNotEmpty('count') })
  @IsNumber({}, { message: requestMessages.isNumber('count') })
  count: number;

  @IsNotEmpty({ message: requestMessages.isNotEmpty('amount') })
  @IsNumber({}, { message: requestMessages.isNumber('amount') })
  amount: number;

  @IsNotEmpty({ message: requestMessages.isNotEmpty('productTitle') })
  @IsString({ message: requestMessages.isString('productTitle') })
  productTitle: string;

  @IsNotEmpty({ message: requestMessages.isNotEmpty('hashHex') })
  @IsString({ message: requestMessages.isString('hashHex') })
  hashHex: string;
}
