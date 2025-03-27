import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import { getCtxData } from 'src/libs/common';
import { UserRepository } from './repositories/user.repository';
import { UserRolesRepository } from 'src/roles/repositories/user-roles.repository';
import { InitUserDto } from './dto/init-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userRolesRepository: UserRolesRepository,
  ) {}

  async updateUserNamesByCtx(ctx: Context) {
    const { ctxUser } = getCtxData(ctx);
    const telegramId = ctxUser.id;
    const firstName = ctxUser.first_name;
    const lastName = ctxUser.last_name;
    const userName = ctxUser.username;

    try {
      await this.userRepository.update(
        { firstName, lastName, userName },
        { where: { telegramId: String(telegramId) } },
      );
    } catch (error) {}

    if (telegramId == process.env.CODER_TG_ID) {
      const user = await this.userRepository.findByTgId(telegramId);

      if (user) {
        await this.userRolesRepository.findOrCreate({
          where: {
            userId: user.id,
            roleName: 'SUPER_ADMIN',
          },
          defaults: {
            userId: user.id,
            roleName: 'SUPER_ADMIN',
          },
        });
      }
    }
  }

  async findOrCreateUserByCtx(ctx: Context | any) {
    const { ctxUser } = getCtxData(ctx);
    const { id, first_name, last_name, username } = ctxUser;

    const isCreated = await this.userRepository.findByTgId(id);
    if (isCreated) return isCreated;

    const user = await this.userRepository.create({
      telegramId: id,
      firstName: first_name?.trim(),
      lastName: last_name?.trim(),
      userName: username?.trim(),
    });

    return user;
  }

  async initUser(userData: InitUserDto) {
    let user = await this.userRepository.findOne({
      where: { telegramId: userData.telegramId },
    });

    if (!user) {
      user = await this.userRepository.create(userData);
      return { user };
    }

    this.userRepository.update(
      { lastLogin: new Date() },
      { where: { id: user.id } },
    );

    try {
      user.firstName = userData?.firstName;
      user.lastName = userData?.lastName;
      user.userName = userData?.userName;
    } catch (error) {}

    // глобально на всю функцию
    await user.save();

    return { user };
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findByPk(id);

    return user;
  }
}
