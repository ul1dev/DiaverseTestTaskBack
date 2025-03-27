import { Injectable } from '@nestjs/common';
import { ConnectWalletDto } from './dto/connect-wallet.dto';
import { WalletRepository } from './repositories/wallet.repository';

@Injectable()
export class WalletService {
  constructor(private readonly walletRepository: WalletRepository) {}

  async connectWallet(walletData: ConnectWalletDto) {
    const { address, publicKey, userId } = walletData;

    const wallet = await this.walletRepository.findOne({
      where: { address },
    });

    if (wallet) {
      wallet.publicKey = publicKey;
      await wallet.save();
    } else {
      await this.walletRepository.create({
        address,
        publicKey,
        userId,
      });
    }

    return { success: true };
  }
}
