import { Injectable } from '@nestjs/common';
import { TransactionRepository } from './repositories/transaction.repository';
import { CreateTransactionDto } from './dto/create-transaction';
import { Cron, CronExpression } from '@nestjs/schedule';
import { getTransactionInfo } from './assets/ton-utils';
import { TransactionStatus } from './models/transaction.model';

@Injectable()
export class TransactionsService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async getTransactionById(id: string) {
    const transaction = await this.transactionRepository.findByPk(id);

    return transaction;
  }

  async getTransactionByHash(hashHex: string) {
    const transaction = await this.transactionRepository.findOne({
      where: {
        hashHex,
      },
    });

    return transaction;
  }

  async getAllTransactionsByUserId(userId: string) {
    const transaction = await this.transactionRepository.findAll({
      where: {
        userId,
        status: TransactionStatus.PROCESSED,
      },
    });

    return transaction;
  }

  async createTransaction(data: CreateTransactionDto) {
    const transaction = await this.transactionRepository.create({
      ...data,
      status: TransactionStatus.PROCESSING,
    });

    return transaction;
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async checkPendingTransactions() {
    const transactions = await this.transactionRepository.findAll({
      where: { status: TransactionStatus.PROCESSING },
    });

    for (const transaction of transactions) {
      try {
        const txInfo = await getTransactionInfo(transaction.hashHex);

        if (txInfo.success) {
          await transaction.update({ status: TransactionStatus.PROCESSED });
        } else if (txInfo.end_status === 'not-applicable') {
          await transaction.update({ status: TransactionStatus.CANCELLED });
        }
      } catch (error) {
        console.error(`Error checking tx ${transaction.hashHex}:`, error);
      }
    }
  }
}
