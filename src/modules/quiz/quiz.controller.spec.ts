import { Test, TestingModule } from '@nestjs/testing';
import { QuizController } from './quiz.controller';
import { PrismaModule } from '@modules/prisma/prisma.module';
import { QuizService } from './quiz.service';
import {
  CreateUpdateQuizDto,
  QuizContent,
} from './dto/create-update.dto';
import { ClassUserModule } from '@modules/class-user/class-user.module';

describe('QuizController', () => {
  let controller: QuizController;

  beforeEach(async () => {
    const mockService = {
      getByMid: jest
        .fn()
        .mockImplementation(
          (m_id: bigint, page: number, limit: number) => {
            if (!m_id || !page || !limit) {
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
          (m_id: bigint, content: QuizContent) => {
            if (!m_id || !content) {
              return Promise.reject(new Error('Error'));
            }
            return Promise.resolve(
              'Quiz created successfully',
            );
          },
        ),
      getQuizByLLM: jest
        .fn()
        .mockImplementation((m_id: bigint) => {
          if (!m_id) {
            return Promise.reject(new Error('Error'));
          }
          return Promise.resolve({
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
          });
        }),
      update: jest
        .fn()
        .mockImplementation(
          (q_id: bigint, content: CreateUpdateQuizDto) => {
            if (!q_id || !content) {
              return Promise.reject(new Error('Error'));
            }
            return Promise.resolve({
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
            });
          },
        ),
      remove: jest
        .fn()
        .mockImplementation((q_id: bigint) => {
          if (!q_id) {
            return Promise.reject(new Error('Error'));
          }
          return Promise.resolve('remove success');
        }),
    };

    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [QuizController],
        imports: [ClassUserModule, PrismaModule],
        providers: [
          {
            provide: QuizService,
            useValue: mockService,
          },
        ],
      }).compile();

    controller = module.get<QuizController>(QuizController);
  });

  it('should create a quiz successfully', async () => {
    const m_id: bigint = BigInt(1);
    const quizContent: CreateUpdateQuizDto = {
      content: {
        question: '새로운 퀴즈의 질문',
        answer: {
          a: '답변 a',
          b: '답변 b',
          c: '답변 c',
          d: '답변 d',
        },
        commentary: {
          correctAnswer: 'a',
          content: '해설 내용',
        },
      },
    };

    const result = await controller.create(
      m_id,
      quizContent,
    );

    expect(result).toBeDefined();
    expect(result).toBe('Quiz created successfully');
  });

  it('should throw an error if required parameters are missing', async () => {
    await expect(
      controller.create(BigInt(0), null),
    ).rejects.toThrow('Error');
  });

  it('should get quiz by material id successfully', async () => {
    const m_id: bigint = BigInt(1);
    const page: number = 1;
    const limit: number = 2;

    const result = await controller.getByMid(
      m_id,
      page,
      limit,
    );

    expect(result).toBeDefined();
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
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
    });
    expect(result[1]).toEqual({
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
    });
  });

  it('should throw an error if required parameters are missing', async () => {
    await expect(
      controller.getByMid(BigInt(0), null, null),
    ).rejects.toThrow('Error');
  });

  it('should get quiz by material id successfully', async () => {
    const m_id: bigint = BigInt(1);

    const result = await controller.getQuizByLLM(m_id);

    expect(result).toBeDefined();
    expect(result).toEqual({
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
    });
  });

  it('should throw an error if required parameters are missing', async () => {
    await expect(
      controller.getQuizByLLM(BigInt(0)),
    ).rejects.toThrow('Error');
  });

  it('should update quiz successfully', async () => {
    const q_id: bigint = BigInt(1);
    const quizContent: CreateUpdateQuizDto = {
      content: {
        question: '수정된 퀴즈의 질문',
        answer: {
          a: '수정된 답변 A',
          b: '수정된 답변 B',
          c: '수정된 답변 C',
          d: '수정된 답변 D',
        },
        commentary: {
          correctAnswer: 'a',
          content: '수정된 해설 내용',
        },
      },
    };

    const result = await controller.update(
      q_id,
      quizContent,
    );

    expect(result).toBeDefined();
    expect(result).toEqual({
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
    });
  });

  it('should throw an error if required parameters are missing', async () => {
    await expect(
      controller.update(BigInt(0), null),
    ).rejects.toThrow('Error');
  });

  it('should remove quiz successfully', async () => {
    const q_id: bigint = BigInt(1);

    const result = await controller.remove(q_id);

    expect(result).toBeDefined();
    expect(result).toBe('remove success');
  });

  it('should throw an error if required parameters are missing', async () => {
    await expect(
      controller.remove(BigInt(0)),
    ).rejects.toThrow('Error');
  });
});
