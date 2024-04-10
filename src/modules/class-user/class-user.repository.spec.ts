import { Test, TestingModule } from '@nestjs/testing';
import { ClassUserRepository } from './class-user.repository';
import { PrismaService } from '../prisma/prisma.service';

describe('ClassUserRepository', () => {
  let classUserRepository: ClassUserRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          ClassUserRepository,
          {
            provide: PrismaService,
            useValue: {
              classUser: {
                findUnique: jest.fn().mockResolvedValue({
                  u_id: 1n,
                  c_id: 1n,
                  role: 'USER',
                  nickname: 'test1',
                  is_favorite: true,
                }),
                findMany: jest.fn().mockResolvedValue([
                  {
                    u_id: 1n,
                    c_id: 1n,
                    role: 'USER',
                    nickname: 'test1',
                    is_favorite: true,
                  },
                  {
                    u_id: 2n,
                    c_id: 1n,
                    role: 'ADMIN',
                    nickname: 'test2',
                    is_favorite: true,
                  },
                ]),
              },
            },
          },
        ],
      }).compile();

    classUserRepository = module.get<ClassUserRepository>(
      ClassUserRepository,
    );
    prismaService =
      module.get<PrismaService>(PrismaService);
  });

  it('should return class user', async () => {
    expect(
      await classUserRepository.getClassUserInfo(1n, 1n),
    ).toEqual({
      u_id: 1n,
      c_id: 1n,
      role: 'USER',
      nickname: 'test1',
      is_favorite: true,
    });
    expect(
      prismaService.classUser.findUnique,
    ).toHaveBeenCalledTimes(1);
    expect(
      prismaService.classUser.findUnique,
    ).toHaveBeenCalledWith({
      where: { u_id_c_id: { u_id: 1n, c_id: 1n } },
    });
  });

  it('should return class users', async () => {
    expect(
      await classUserRepository.getClassUsersInfo(1n, 1, 2),
    ).toEqual([
      {
        u_id: 1n,
        c_id: 1n,
        role: 'USER',
        nickname: 'test1',
        is_favorite: true,
      },
      {
        u_id: 2n,
        c_id: 1n,
        role: 'ADMIN',
        nickname: 'test2',
        is_favorite: true,
      },
    ]);
    expect(
      prismaService.classUser.findMany,
    ).toHaveBeenCalledWith({
      where: { c_id: 1n },
      skip: 0,
      take: 2,
      select: {
        u_id: true,
        nickname: true,
      },
      orderBy: {
        u_id: 'asc',
      },
    });
  });
});
