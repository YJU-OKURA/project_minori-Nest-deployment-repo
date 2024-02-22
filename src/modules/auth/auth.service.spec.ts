import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;

  const u_id = 3n;
  const c_id = 3n;
  const role = 'USER';
  const nickname = 'test';
  const is_favorite = true;

  const classUserData = {
    u_id,
    c_id,
    nickname,
    is_favorite,
    role,
  };

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          AuthService,
          {
            provide: PrismaService,
            useValue: {
              class_user: {
                findUnique: jest
                  .fn()
                  .mockResolvedValue(classUserData),
              },
            },
          },
        ],
      }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService =
      module.get<PrismaService>(PrismaService);
  });

  it('should return class user', async () => {
    expect(
      await authService.getClassUserInfo(u_id, c_id),
    ).toEqual(classUserData);
    expect(
      prismaService.class_user.findUnique,
    ).toHaveBeenCalledTimes(1);
    expect(
      prismaService.class_user.findUnique,
    ).toHaveBeenCalledWith({
      where: { u_id_c_id: { u_id, c_id } },
    });
  });
});
