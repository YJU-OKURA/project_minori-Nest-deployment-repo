import { Test, TestingModule } from '@nestjs/testing';
import { QuizBankController } from './quiz-bank.controller';
import { UpdateQuizDto as CreateUpdateQuizDto } from '@modules/quiz/dto/create-update.dto';
import { ClassUserModule } from '@modules/class-user/class-user.module';
import { PrismaModule } from '@modules/prisma/prisma.module';
import { QuizBankService } from './quiz-bank.service';

describe('QuizBankController', () => {
  let controller: QuizBankController;

  beforeEach(async () => {
    const mockService = {
      search: jest
        .fn()
        .mockImplementation(
          (
            u_id: bigint,
            page: number,
            limit: number,
            keyword: string,
          ) => {
            if (!u_id || !page || !limit || !keyword) {
              return Promise.reject(new Error('Error'));
            }
            return Promise.resolve([
              {
                id: 1,
                content: {
                  question: 'test1',
                  answer: {
                    a: 'test1',
                    b: 'test1',
                    c: 'test1',
                    d: 'test1',
                  },
                  commentary: {
                    correctAnswer: 'a',
                    content: 'test',
                  },
                },
              },
              {
                id: 2,
                content: {
                  question: 'test2',
                  answer: {
                    a: 'test2',
                    b: 'test2',
                    c: 'test2',
                    d: 'test2',
                  },
                  commentary: {
                    correctAnswer: 'b',
                    content: 'test',
                  },
                },
              },
            ]);
          },
        ),
      get: jest.fn().mockImplementation((id: bigint) => {
        if (!id) {
          return Promise.reject(new Error('Error'));
        }
        return Promise.resolve({
          id: 1,
          content: {
            question: 'test',
            answer: {
              a: 'test',
              b: 'test',
              c: 'test',
              d: 'test',
            },
            commentary: {
              correctAnswer: 'a',
              content: 'test',
            },
          },
        });
      }),
      getMany: jest
        .fn()
        .mockImplementation(
          (u_id: bigint, page: number, limit: number) => {
            if (!u_id || !page || !limit) {
              return Promise.reject(new Error('Error'));
            }
            return Promise.resolve([
              {
                id: 1,
                content: {
                  question: 'test1',
                  answer: {
                    a: 'test1',
                    b: 'test1',
                    c: 'test1',
                    d: 'test1',
                  },
                  commentary: {
                    correctAnswer: 'a',
                    content: 'test',
                  },
                },
              },
              {
                id: 2,
                content: {
                  question: 'test2',
                  answer: {
                    a: 'test2',
                    b: 'test2',
                    c: 'test2',
                    d: 'test2',
                  },
                  commentary: {
                    correctAnswer: 'b',
                    content: 'test',
                  },
                },
              },
            ]);
          },
        ),
      create: jest
        .fn()
        .mockImplementation(
          (
            c_id: bigint,
            u_id: bigint,
            body: CreateUpdateQuizDto,
          ) => {
            if (!c_id || !u_id || !body) {
              return Promise.reject(new Error('Error'));
            }
            return Promise.resolve('Success');
          },
        ),
      update: jest
        .fn()
        .mockImplementation(
          (id: bigint, body: CreateUpdateQuizDto) => {
            if (!id || !body) {
              return Promise.reject(new Error('Error'));
            }
            return Promise.resolve('Success');
          },
        ),
      remove: jest.fn().mockImplementation((id: bigint) => {
        if (!id) {
          return Promise.reject(new Error('Error'));
        }
        return Promise.resolve('Success');
      }),
    };

    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [QuizBankController],
        imports: [ClassUserModule, PrismaModule],
        providers: [
          {
            provide: QuizBankService,
            useValue: mockService,
          },
        ],
      }).compile();

    controller = module.get<QuizBankController>(
      QuizBankController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should search quiz bank', async () => {
    const result = await controller.search(
      1n,
      1,
      2,
      'test',
    );
    expect(result).toEqual([
      {
        id: 1,
        content: {
          question: 'test1',
          answer: {
            a: 'test1',
            b: 'test1',
            c: 'test1',
            d: 'test1',
          },
          commentary: {
            correctAnswer: 'a',
            content: 'test',
          },
        },
      },
      {
        id: 2,
        content: {
          question: 'test2',
          answer: {
            a: 'test2',
            b: 'test2',
            c: 'test2',
            d: 'test2',
          },
          commentary: {
            correctAnswer: 'b',
            content: 'test',
          },
        },
      },
    ]);
  });

  it('should fail to search quiz bank', async () => {
    await expect(
      controller.search(0n, 0, 0, ''),
    ).rejects.toThrow('Error');
  });

  it('should get quiz by id', async () => {
    const result = await controller.get(1n);
    expect(result).toEqual({
      id: 1,
      content: {
        question: 'test',
        answer: {
          a: 'test',
          b: 'test',
          c: 'test',
          d: 'test',
        },
        commentary: {
          correctAnswer: 'a',
          content: 'test',
        },
      },
    });
  });

  it('should fail to get quiz by id', async () => {
    await expect(controller.get(0n)).rejects.toThrow(
      'Error',
    );
  });

  it('should get many quiz', async () => {
    const result = await controller.getMany(1n, 1, 2);
    expect(result).toEqual([
      {
        id: 1,
        content: {
          question: 'test1',
          answer: {
            a: 'test1',
            b: 'test1',
            c: 'test1',
            d: 'test1',
          },
          commentary: {
            correctAnswer: 'a',
            content: 'test',
          },
        },
      },
      {
        id: 2,
        content: {
          question: 'test2',
          answer: {
            a: 'test2',
            b: 'test2',
            c: 'test2',
            d: 'test2',
          },
          commentary: {
            correctAnswer: 'b',
            content: 'test',
          },
        },
      },
    ]);
  });

  it('should fail to get many quiz', async () => {
    await expect(
      controller.getMany(0n, 0, 0),
    ).rejects.toThrow('Error');
  });

  it('should create quiz', async () => {
    const result = await controller.create(1n, 1n, {
      q_id: 1n,
    });
    expect(result).toBe('Success');
  });

  it('should fail to create quiz', async () => {
    await expect(
      controller.create(0n, 0n, { q_id: 0n }),
    ).rejects.toThrow('Error');
  });

  it('should update quiz', async () => {
    const result = await controller.update(1n, {
      content: {
        question: 'test',
        answer: {
          a: 'test',
          b: 'test',
          c: 'test',
          d: 'test',
        },
        commentary: {
          correctAnswer: 'a',
          content: 'test',
        },
      },
    });
    expect(result).toBe('Success');
  });

  it('should fail to update quiz', async () => {
    await expect(
      controller.update(0n, {} as CreateUpdateQuizDto),
    ).rejects.toThrow('Error');
  });

  it('should remove quiz', async () => {
    const result = await controller.remove(1n);
    expect(result).toBe('Success');
  });

  it('should fail to remove quiz', async () => {
    await expect(controller.remove(0n)).rejects.toThrow(
      'Error',
    );
  });
});
