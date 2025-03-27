import { AbstractRepository } from 'src/libs/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Wallet, WalletCreationArgs } from '../models/wallet.model';

@Injectable()
export class WalletRepository extends AbstractRepository<
  Wallet,
  WalletCreationArgs
> {
  protected readonly logger = new Logger(Wallet.name);

  constructor(
    @InjectModel(Wallet)
    private walletModel: typeof Wallet,
  ) {
    super(walletModel);
  }
}
