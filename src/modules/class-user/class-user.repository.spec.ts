import { Test, TestingModule } from '@nestjs/testing';
import { ClassUserRepository } from './class-user.repository';
import { PrismaService } from '../prisma/prisma.service';

describe('ClassUserRepository', () => {
  let classUserService: ClassUserRepository;
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
          ClassUserRepository,
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

    classUserService = module.get<ClassUserRepository>(
      ClassUserRepository,
    );
    prismaService =
      module.get<PrismaService>(PrismaService);
  });

  it('should return class user', async () => {
    expect(
      await classUserService.getClassUserInfo(u_id, c_id),
    ).toEqual(classUserData);
    expect(
      prismaService.classUser.findUnique,
    ).toHaveBeenCalledTimes(1);
    expect(
      prismaService.classUser.findUnique,
    ).toHaveBeenCalledWith({
      where: { u_id_c_id: { u_id, c_id } },
    });
  });
});
