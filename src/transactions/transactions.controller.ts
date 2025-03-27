import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { SecureInterceptor } from 'src/interceptors/secure.interceptor';
import { CreateTransactionDto } from './dto/create-transaction';

@UseInterceptors(SecureInterceptor)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get('/by-id/:transactionId')
  async getTransactionById(@Param('transactionId') id: string) {
    return this.transactionsService.getTransactionById(id);
  }

  @Get('/by-hash/:hash')
  getTransactionByHash(@Param('hash') hash: string) {
    return this.transactionsService.getTransactionByHash(hash);
  }

  @Get('/completed/by-user-id/:userId')
  findOne(@Param('userId') userId: string) {
    return this.transactionsService.getAllTransactionsByUserId(userId);
  }

  @Post()
  async createTransaction(@Body() body: CreateTransactionDto) {
    return this.transactionsService.createTransaction(body);
  }
}
