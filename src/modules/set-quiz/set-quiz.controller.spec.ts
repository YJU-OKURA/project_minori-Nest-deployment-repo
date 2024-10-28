import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '@modules/prisma/prisma.module';
import { ClassUserRepository } from '@modules/class-user/class-user.repository';
import { SetQuizController } from './set-quiz.controller';
import { SetQuizService } from './set-quiz.service';
import { MarkSetQuizDto } from './dto/mark.dto';
import { CreateSetQuizDto } from './dto/create.dto';
import { UpdateSetQuizDto } from './dto/update.dto';
import { OwnerGuard } from '@common/guards/owner.guard';
import { RolesGuard } from '@common/guards/role.guard';
import { ClassUserModule } from '@modules/class-user/class-user.module';

describe('SetQuizController', () => {
  let controller: SetQuizController;
  let service: SetQuizService;

  beforeEach(async () => {
    const mockService = {
      get: jest.fn().mockImplementation((m_id: bigint) => {
        if (!m_id) {
          return Promise.reject(new Error('Error'));
        }
        return Promise.resolve([
          {
            id: 0,
            content: {
              question: 'What is the capital of Japan?',
              answer: {
                a: 'Tokyo',
                b: 'Osaka',
                c: 'Kyoto',
                d: 'Hokkaido',
              },
              commentary: {
                correctAnswer: 'a',
                content: 'Tokyo is the capital of Japan.',
              },
            },
          },
        ]);
      }),
      mark: jest
        .fn()
        .mockImplementation(
          (
            u_id: bigint,
            c_id: bigint,
            m_id: bigint,
            body: MarkSetQuizDto,
          ) => {
            if (!u_id || !c_id || !m_id || !body) {
              return Promise.reject(new Error('Error'));
            }
            return Promise.resolve('mark success');
          },
        ),
      getResultByNickname: jest
        .fn()
        .mockImplementation(
          (
            m_id: bigint,
            c_id: bigint,
            nickname: string,
            page: number,
            limit: number,
          ) => {
            if (
              !m_id ||
              !c_id ||
              !nickname ||
              !page ||
              !limit
            ) {
              return Promise.reject(new Error('Error'));
            }
            return Promise.resolve([
              {
                u_id: '1',
                nickname: 'user1',
                collectedRate: 'N/A',
              },
              {
                u_id: '2',
                nickname: 'user2',
                collectedRate: 100,
              },
            ]);
          },
        ),
      post: jest
        .fn()
        .mockImplementation(
          (m_id: bigint, body: CreateSetQuizDto) => {
            if (!m_id || !body) {
              return Promise.reject(new Error('Error'));
            }
            return Promise.resolve('post success');
          },
        ),
      updatePost: jest
        .fn()
        .mockImplementation(
          (m_id: bigint, body: UpdateSetQuizDto) => {
            if (!m_id || !body) {
              return Promise.reject(new Error('Error'));
            }
            return Promise.resolve('update post success');
          },
        ),
      getStatisticsUsers: jest
        .fn()
        .mockImplementation((c_id, m_id, page, limit) => {
          if (!c_id || !m_id || !page || !limit) {
            return Promise.reject(new Error('Error'));
          }
          return Promise.resolve([
            {
              u_id: 1,
              nickname: 'test1',
              collectRate: 100,
            },
            {
              u_id: 2,
              nickname: 'test2',
              collectRate: 90,
            },
          ]);
        }),
      getStatisticsClass: jest
        .fn()
        .mockImplementation((c_id, m_id) => {
          if (!c_id || !m_id) {
            return Promise.reject(new Error('Error'));
          }
          return Promise.resolve({
            attendRate: 80,
            collectRate: 90,
          });
        }),
      getResultByUId: jest
        .fn()
        .mockImplementation(
          (u_id: bigint, m_id: bigint) => {
            if (!u_id || !m_id) {
              return Promise.reject(new Error('Error'));
            }
            return Promise.resolve({
              collectRate: 100,
              results: [
                {
                  content: {
                    q_id: 1,
                    question:
                      'What is the capital of Japan?',
                  },
                  result: true,
                },
              ],
            });
          },
        ),
      remove: jest
        .fn()
        .mockImplementation((m_id: bigint) => {
          if (!m_id) {
            return Promise.reject(new Error('Error'));
          }
          return Promise.resolve('remove success');
        }),
    };

    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [SetQuizController],
        imports: [PrismaModule, ClassUserModule],
        providers: [
          {
            provide: SetQuizService,
            useValue: mockService,
          },
          ClassUserRepository,
          OwnerGuard,
          RolesGuard,
        ],
      }).compile();

    controller = module.get<SetQuizController>(
      SetQuizController,
    );
    service = module.get<SetQuizService>(SetQuizService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get quiz', async () => {
    const result = await controller.get(1n);
    expect(result).toEqual([
      {
        id: 0,
        content: {
          question: 'What is the capital of Japan?',
          answer: {
            a: 'Tokyo',
            b: 'Osaka',
            c: 'Kyoto',
            d: 'Hokkaido',
          },
          commentary: {
            correctAnswer: 'a',
            content: 'Tokyo is the capital of Japan.',
          },
        },
      },
    ]);
  });

  it('should be failed to get quiz', async () => {
    await expect(controller.get(null)).rejects.toThrow(
      'Error',
    );
  });

  it('should mark quiz', async () => {
    const result = await controller.mark(1n, 1n, 1n, {
      created_at: new Date(),
      quizResults: [
        {
          q_id: BigInt(1),
          result: true,
          answer: 'a',
        },
      ],
    });
    expect(result).toBe('mark success');
  });

  it('should be failed to mark quiz', async () => {
    await expect(
      controller.mark(null, null, null, {
        created_at: null,
        quizResults: null,
      }),
    ).rejects.toThrow('Error');
  });

  it('should get result by nickname', async () => {
    const result = await controller.getResultByNickname(
      1n,
      1n,
      'user1',
      1,
      2,
    );
    expect(result).toEqual([
      {
        u_id: '1',
        nickname: 'user1',
        collectedRate: 'N/A',
      },
      {
        u_id: '2',
        nickname: 'user2',
        collectedRate: 100,
      },
    ]);
  });

  it('should be failed to get result by nickname', async () => {
    await expect(
      controller.getResultByNickname(
        null,
        null,
        null,
        null,
        null,
      ),
    ).rejects.toThrow('Error');
  });

  it('should post quiz', async () => {
    const result = await controller.post(1n, {
      deadline: new Date(),
      setQuizData: [BigInt(1), BigInt(2)],
    });
    expect(result).toBe('post success');
  });

  it('should be failed to post quiz', async () => {
    await expect(
      controller.post(null, {
        deadline: null,
        setQuizData: null,
      }),
    ).rejects.toThrow('Error');
  });

  it('should update post quiz', async () => {
    const result = await controller.updatePost(1n, {
      deadline: new Date(),
      setQuizData: [BigInt(1)],
    });
    expect(result).toBe('update post success');
  });

  it('should be failed to update post quiz', async () => {
    await expect(
      controller.updatePost(null, {
        deadline: null,
        setQuizData: null,
      }),
    ).rejects.toThrow('Error');
  });

  it('should get result', async () => {
    const result = await controller.getResult(1n, 1n);
    result;
    expect(result).toEqual({
      collectRate: 100,
      results: [
        {
          content: {
            q_id: 1,
            question: 'What is the capital of Japan?',
          },
          result: true,
        },
      ],
    });
  });

  it('should be failed to get result', async () => {
    await expect(
      controller.getResult(null, null),
    ).rejects.toThrow('Error');
  });

  it('should get statistics users', async () => {
    const result = await controller.getStatisticsUsers(
      1n,
      1n,
      1,
      10,
    );
    expect(result).toEqual([
      {
        u_id: 1,
        nickname: 'test1',
        collectRate: 100,
      },
      {
        u_id: 2,
        nickname: 'test2',
        collectRate: 90,
      },
    ]);
  });

  it('should be failed to get statistics users', async () => {
    await expect(
      controller.getStatisticsUsers(null, null, null, null),
    ).rejects.toThrow('Error');
  });

  it('should get statistics class', async () => {
    const result = await controller.getStatisticsClass(
      1n,
      1n,
    );
    expect(result).toEqual({
      attendRate: 80,
      collectRate: 90,
    });
  });

  it('should be failed to get statistics class', async () => {
    await expect(
      controller.getStatisticsClass(null, null),
    ).rejects.toThrow('Error');
  });

  it('should remove quiz', async () => {
    const result = await controller.remove(1n);
    expect(result).toBe('remove success');
  });

  it('should be failed to remove quiz', async () => {
    await expect(controller.remove(null)).rejects.toThrow(
      'Error',
    );
  });
});
