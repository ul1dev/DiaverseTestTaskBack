import { Controller, UseInterceptors, Post, Body } from '@nestjs/common';
import { SecureInterceptor } from 'src/interceptors/secure.interceptor';
import { WalletService } from './wallet.service';
import { ConnectWalletDto } from './dto/connect-wallet.dto';

@UseInterceptors(SecureInterceptor)
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('connect')
  async connectWallet(@Body() walletDto: ConnectWalletDto) {
    return await this.walletService.connectWallet(walletDto);
  }
}
