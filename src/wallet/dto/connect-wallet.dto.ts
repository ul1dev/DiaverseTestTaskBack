import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { requestMessages } from 'src/libs/common';

export class ConnectWalletDto {
  @IsNotEmpty({ message: requestMessages.isNotEmpty('userId') })
  @IsString({ message: requestMessages.isString('userId') })
  userId: string;

  @IsNotEmpty({ message: requestMessages.isNotEmpty('address') })
  @IsString({ message: requestMessages.isString('address') })
  address: string;

  @IsOptional()
  @IsString({ message: requestMessages.isString('publicKey') })
  publicKey: string;
}
