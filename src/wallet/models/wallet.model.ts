import {
  Column,
  Table,
  DataType,
  HasMany,
  ForeignKey,
} from 'sequelize-typescript';
import { AbstractModel } from 'src/libs/common';
import { User } from 'src/users/models/user.model';

export interface WalletCreationArgs {
  userId: string;
  address: string;
  publicKey?: string;
}

@Table({ tableName: 'Wallets' })
export class Wallet extends AbstractModel<Wallet, WalletCreationArgs> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  userId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  address: string;

  @Column({
    type: DataType.STRING,
  })
  publicKey: string;
}
