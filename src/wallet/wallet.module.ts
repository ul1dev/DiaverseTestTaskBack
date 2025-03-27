import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { DatabaseModule } from 'src/libs/common';
import { Wallet } from './models/wallet.model';
import { WalletRepository } from './repositories/wallet.repository';
import { CustomCacheModule } from 'src/cache/cache.module';
import { CryptoModule } from 'src/crypto/crypto.module';

@Module({
  imports: [
    DatabaseModule.forFeature([Wallet]),
    CryptoModule,
    CustomCacheModule,
  ],
  controllers: [WalletController],
  providers: [WalletService, WalletRepository],
})
export class WalletModule {}
