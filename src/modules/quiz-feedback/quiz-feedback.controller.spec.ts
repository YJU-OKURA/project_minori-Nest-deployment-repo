import { Test, TestingModule } from '@nestjs/testing';
import { QuizFeedbackController } from './quiz-feedback.controller';
import { QuizFeedbackService } from './quiz-feedback.service';
import { CreateAndUpdateFeedbackDto } from './dto/create-update.dto';
import { DeleteFeedbackDto } from './dto/delete.dto';
import { ClassUserModule } from '@modules/class-user/class-user.module';
import { PrismaModule } from '@modules/prisma/prisma.module';
import { OwnerGuard } from '@common/guards/owner.guard';
import { RolesGuard } from '@common/guards/role.guard';

describe('QuizFeedbackController', () => {
  let controller: QuizFeedbackController;
  let service: QuizFeedbackService;

  beforeEach(async () => {
    const mockService = {
      getFeedbacks: jest
        .fn()
        .mockImplementation(
          (m_id: bigint, page: number, limit: number) => {
            if (!m_id || !page || !limit) {
              return Promise.reject(new Error('Error'));
            }
            return Promise.resolve([
              {
                content:
                  '理解度が高いですね、お疲れ様でした😊',
                created_at: '2021-08-30T06:00:00.000Z',
                class_user: {
                  u_id: 1,
                  nickname: 'user1',
                },
              },
            ]);
          },
        ),
      getFeedback: jest
        .fn()
        .mockImplementation(
          (u_id: bigint, c_id: bigint, m_id: bigint) => {
            if (!u_id || !c_id || !m_id) {
              return Promise.reject(new Error('Error'));
            }
            return Promise.resolve({
              content:
                '理解度が高いですね、お疲れ様でした😊',
              created_at: '2021-08-30T06:00:00.000Z',
              class_user: {
                u_id: 1,
                nickname: 'user1',
              },
            });
          },
        ),
      getFeedbacksByNickname: jest
        .fn()
        .mockImplementation(
          (
            m_id: bigint,
            nickname: string,
            page: number,
            limit: number,
          ) => {
            if (!m_id || !nickname || !page || !limit) {
              return Promise.reject(new Error('Error'));
            }
            return Promise.resolve([
              {
                content:
                  '理解度が高いですね、お疲れ様でした😊',
                created_at: '2021-08-30T06:00:00.000Z',
                class_user: {
                  u_id: 1,
                  nickname: 'user1',
                },
              },
            ]);
          },
        ),
      createFeedback: jest
        .fn()
        .mockImplementation(
          (
            u_id: bigint,
            c_id: bigint,
            m_id: bigint,
            content: string,
          ) => {
            if (!u_id || !c_id || !m_id || !content) {
              return Promise.reject(new Error('Error'));
            }
            return Promise.resolve(
              'Feedback created successfully',
            );
          },
        ),
      updateFeedback: jest
        .fn()
        .mockImplementation(
          (
            u_id: bigint,
            c_id: bigint,
            m_id: bigint,
            content: string,
          ) => {
            if (!u_id || !c_id || !m_id || !content) {
              return Promise.reject(new Error('Error'));
            }
            return Promise.resolve(
              'Feedback updated successfully',
            );
          },
        ),
      deleteFeedback: jest
        .fn()
        .mockImplementation(
          (u_id: bigint, c_id: bigint, m_id: bigint) => {
            if (!u_id || !c_id || !m_id) {
              return Promise.reject(new Error('Error'));
            }
            return Promise.resolve(
              'Feedback deleted successfully',
            );
          },
        ),
    };

    const module: TestingModule =
      await Test.createTestingModule({
        imports: [ClassUserModule, PrismaModule],
        controllers: [QuizFeedbackController],
        providers: [
          {
            provide: QuizFeedbackService,
            useValue: mockService,
          },
          OwnerGuard,
          RolesGuard,
        ],
      }).compile();

    controller = module.get<QuizFeedbackController>(
      QuizFeedbackController,
    );
    service = module.get<QuizFeedbackService>(
      QuizFeedbackService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get feedbacks', async () => {
    const result = await controller.getFeedbacks(1n, 1, 10);
    expect(result).toEqual([
      {
        content: '理解度が高いですね、お疲れ様でした😊',
        created_at: '2021-08-30T06:00:00.000Z',
        class_user: {
          u_id: 1,
          nickname: 'user1',
        },
      },
    ]);
  });

  it('it should fail to get feedbacks', async () => {
    await expect(
      controller.getFeedbacks(0n, 0, 0),
    ).rejects.toThrow('Error');
  });

  it('should get feedback', async () => {
    const result = await controller.getFeedback(1n, 1n, 1n);
    expect(result).toEqual({
      content: '理解度が高いですね、お疲れ様でした😊',
      created_at: '2021-08-30T06:00:00.000Z',
      class_user: {
        u_id: 1,
        nickname: 'user1',
      },
    });
  });

  it('it should fail to get feedback', async () => {
    await expect(
      controller.getFeedback(0n, 0n, 0n),
    ).rejects.toThrow('Error');
  });

  it('should get feedbacks by nickname', async () => {
    const result = await controller.getFeedbacksByNickname(
      1n,
      'user1',
      1,
      1,
    );
    expect(result).toEqual([
      {
        content: '理解度が高いですね、お疲れ様でした😊',
        created_at: '2021-08-30T06:00:00.000Z',
        class_user: {
          u_id: 1,
          nickname: 'user1',
        },
      },
      ,
    ]);
  });

  it('it should fail to get feedbacks by nickname', async () => {
    await expect(
      controller.getFeedbacksByNickname(0n, '', 0, 0),
    ).rejects.toThrow('Error');
  });

  it('should create feedback', async () => {
    const dto: CreateAndUpdateFeedbackDto = {
      u_id: 1n,
      content: '理解度が高いですね、お疲れ様でした😊',
    };

    const result = await controller.createFeedback(
      1n,
      1n,
      dto,
    );

    expect(result).toEqual('Feedback created successfully');
  });

  it('it should fail to create feedback', async () => {
    const dto: CreateAndUpdateFeedbackDto = {
      u_id: 0n,
      content: '',
    };

    await expect(
      controller.createFeedback(0n, 0n, dto),
    ).rejects.toThrow('Error');
  });

  it('should update feedback', async () => {
    const dto: CreateAndUpdateFeedbackDto = {
      u_id: 1n,
      content: 'お疲れ様でした😊',
    };

    const result = await controller.updateFeedback(
      1n,
      1n,
      dto,
    );

    expect(result).toEqual('Feedback updated successfully');
  });

  it('it should fail to update feedback', async () => {
    const dto: CreateAndUpdateFeedbackDto = {
      u_id: 0n,
      content: '',
    };

    await expect(
      controller.updateFeedback(0n, 0n, dto),
    ).rejects.toThrow('Error');
  });

  it('should delete feedback', async () => {
    const dto: DeleteFeedbackDto = {
      u_id: 1n,
    };

    const result = await controller.deleteFeedback(
      1n,
      1n,
      dto,
    );

    expect(result).toEqual('Feedback deleted successfully');
  });

  it('it should fail to delete feedback', async () => {
    const dto: DeleteFeedbackDto = {
      u_id: 0n,
    };

    await expect(
      controller.deleteFeedback(0n, 0n, dto),
    ).rejects.toThrow('Error');
  });
});
