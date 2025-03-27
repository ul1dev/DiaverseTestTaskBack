import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from '../../users/models/user.model';
import { AbstractModel } from 'src/libs/common';

export enum TransactionStatus {
  PROCESSING = 'PROCESSING',
  PROCESSED = 'PROCESSED',
  CANCELLED = 'CANCELLED',
}

export enum TransactionCurrency {
  TON = 'TON',
  USD = 'USD',
}

export interface TransactionCreationArgs {
  userId: string;
  status: TransactionStatus;
  currency: TransactionCurrency;
  count: number;
  amount: number;
  productTitle: string;
  hashHex: string;
}

@Table({ tableName: 'Transactions' })
export class Transaction extends AbstractModel<
  Transaction,
  TransactionCreationArgs
> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  userId: string;

  @Column({
    type: DataType.ENUM(...Object.values(TransactionStatus)),
    defaultValue: TransactionStatus.PROCESSING,
  })
  status: TransactionStatus;

  @Column({
    type: DataType.ENUM(...Object.values(TransactionCurrency)),
    allowNull: false,
  })
  currency: TransactionCurrency;

  @Column(DataType.INTEGER)
  count: number;

  @Column(DataType.INTEGER)
  amount: number;

  @Column(DataType.STRING)
  productTitle: string;

  @Column(DataType.STRING)
  hashHex: string;
}
