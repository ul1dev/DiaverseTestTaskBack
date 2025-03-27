import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { StartModule } from './start/start.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GeneralModule } from './general/general.module';
import { validationSchema } from './libs/common';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './general/database/database.module';
import { ListenersModule } from './listeners/listeners.module';
import { ListenersLowModule } from './listeners/listeners-low.module';
import { BansModule } from './bans/bans.module';
import { ChainModule } from './libs/chain/chain.module';
import { RolesModule } from './roles/roles.module';
import { MailingsModule } from './mailings/mailings.module';
import { PaginationModule } from './libs/pagination/pagination.module';
import { FilesModule } from './files/files.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TransactionsModule } from './transactions/transactions.module';
import { APP_GUARD } from '@nestjs/core';
import { CustomThrottlerGuard } from './general/guards';
import { ThrottlerModule } from '@nestjs/throttler';
import { CryptoModule } from './crypto/crypto.module';
import { CacheModule } from '@nestjs/cache-manager';
import { CustomCacheModule } from './cache/cache.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema,
      envFilePath: [`.${process.env.NODE_ENV}.env`, `.env.stage.dev`],
      isGlobal: true,
    }),
    TelegrafModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        token: configService.get('BOT_TOKEN'),
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 1000,
        limit: 10,
      },
    ]),
    CacheModule.register({
      ttl: 70 * 1000,
      max: 1000,
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    StartModule,
    GeneralModule,
    UsersModule,
    PaginationModule,
    ListenersModule,
    BansModule,
    ChainModule,
    RolesModule,
    MailingsModule,
    FilesModule,
    TransactionsModule,
    CryptoModule,
    CustomCacheModule,
    WalletModule,

    // должно быть внизу из за приоритета выполнения
    ListenersLowModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
})
export class AppModule {}
