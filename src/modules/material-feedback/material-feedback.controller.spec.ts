import { Test, TestingModule } from '@nestjs/testing';
import { MaterialFeedbackController } from './material-feedback.controller';
import { MaterialFeedbackService } from './material-feedback.service';
import { Response } from 'express';
import { AuthModule } from '@modules/auth/auth.module';
import { PrismaModule } from '@modules/prisma/prisma.module';

describe('MaterialFeedbackController', () => {
  let controller: MaterialFeedbackController;
  let service: MaterialFeedbackService;

  const mockService = {
    getByMid: jest
      .fn()
      .mockImplementation((m_id, page, limit) => {
        if (!m_id || !page || !limit) {
          return Promise.reject(new Error('Error'));
        }
        return Promise.resolve([
          { id: 1, content: 'Test1' },
          { id: 2, content: 'Test2' },
          { id: 3, content: 'Test3' },
          { id: 4, content: 'Test4' },
          { id: 5, content: 'Test5' },
        ]);
      }),
    getKeyword: jest.fn().mockImplementation((m_id) => {
      if (!m_id || typeof m_id !== 'bigint' || m_id <= 0) {
        return Promise.reject(new Error('Error'));
      }
      return Promise.resolve([
        { page: 1, keyword: ['Test1', 'Test2'] },
        { page: 2, keyword: ['Test3', 'Test4'] },
        { page: 3, keyword: ['Test5', 'Test6'] },
      ]);
    }),
    getFeedback: jest
      .fn()
      .mockImplementation((m_id, response) => {
        if (!m_id || !response) {
          return Promise.reject(new Error('Error'));
        }
        return Promise.resolve(undefined);
      }),
    create: jest
      .fn()
      .mockImplementation((m_id, content) => {
        if (!m_id || !content) {
          return Promise.reject(new Error('Error'));
        }
        return Promise.resolve({
          id: 0,
          content: 'test',
        });
      }),
    remove: jest.fn().mockImplementation((m_id) => {
      if (!m_id) {
        return Promise.reject(new Error('Error'));
      }
      return Promise.resolve('remove success');
    }),
  };

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        imports: [PrismaModule, AuthModule],
        controllers: [MaterialFeedbackController],
        providers: [
          {
            provide: MaterialFeedbackService,
            useValue: mockService,
          },
        ],
      }).compile();

    controller = module.get<MaterialFeedbackController>(
      MaterialFeedbackController,
    );
    service = module.get<MaterialFeedbackService>(
      MaterialFeedbackService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getByMid', () => {
    it('should return feedback by material ID', async () => {
      const m_id = BigInt(1);
      const page = 1;
      const limit = 5;

      expect(
        await controller.getByMid(m_id, page, limit),
      ).toEqual([
        { id: 1, content: 'Test1' },
        { id: 2, content: 'Test2' },
        { id: 3, content: 'Test3' },
        { id: 4, content: 'Test4' },
        { id: 5, content: 'Test5' },
      ]);
    });
  });

  describe('getByMid', () => {
    it('should return feedback array on success', async () => {
      await expect(
        controller.getByMid(BigInt(1), 1, 5),
      ).resolves.toEqual([
        { id: 1, content: 'Test1' },
        { id: 2, content: 'Test2' },
        { id: 3, content: 'Test3' },
        { id: 4, content: 'Test4' },
        { id: 5, content: 'Test5' },
      ]);
    });

    it('should throw an error if parameters are missing', async () => {
      await expect(
        controller.getByMid(null, 1, 10),
      ).rejects.toThrow('Error');
    });
  });

  describe('getKeyword', () => {
    it('should return keywords for a material', async () => {
      const m_id = BigInt(1);

      expect(await controller.getKeyword(m_id)).toEqual([
        { page: 1, keyword: ['Test1', 'Test2'] },
        { page: 2, keyword: ['Test3', 'Test4'] },
        { page: 3, keyword: ['Test5', 'Test6'] },
      ]);
    });
    it('should throw an error if m_id is missing', async () => {
      await expect(
        controller.getKeyword(undefined),
      ).rejects.toThrow('Error');
    });
  });

  function mockResponse(): Response {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnThis();
    res.send = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    res.end = jest.fn().mockReturnThis();
    res.write = jest.fn().mockReturnThis();
    res.writeHead = jest.fn().mockReturnThis();
    return res as Response;
  }

  describe('getFeedback', () => {
    it('should return success on success', async () => {
      const response = mockResponse();
      await expect(
        controller.getFeedback(BigInt(1), response),
      ).resolves.toEqual(undefined);
    });

    it('should throw an error if parameters are missing', async () => {
      const response = mockResponse();
      await expect(
        controller.getFeedback(null, response),
      ).rejects.toThrow('Error');
    });
  });

  describe('create', () => {
    it('should return created feedback on success', async () => {
      await expect(
        controller.create(BigInt(1), { content: 'test' }),
      ).resolves.toEqual({
        id: 0,
        content: 'test',
      });
    });

    it('should throw an error if parameters are missing', async () => {
      await expect(
        controller.create(null, { content: 'test' }),
      ).rejects.toThrow('Error');
    });
  });

  describe('remove', () => {
    it('should return success message on success', async () => {
      await expect(
        controller.remove(BigInt(1)),
      ).resolves.toEqual('remove success');
    });

    it('should throw an error if m_id is missing', async () => {
      await expect(controller.remove(null)).rejects.toThrow(
        'Error',
      );
    });
  });
});
