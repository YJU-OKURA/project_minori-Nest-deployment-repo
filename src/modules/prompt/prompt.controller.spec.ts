import { Test, TestingModule } from '@nestjs/testing';
import { PromptController } from './prompt.controller';
import { PromptService } from './prompt.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '@modules/prisma/prisma.module';
import { AuthService } from '@modules/auth/auth.service';
import { Response } from 'express';

describe('PromptController', () => {
  let controller: PromptController;
  let service: PromptService;

  beforeEach(async () => {
    const mockService = {
      get: jest.fn().mockImplementation((id) => {
        if (!id) {
          return Promise.reject(new Error('Error'));
        }
        return Promise.resolve({
          id: 1,
          message: 'test',
          prompts: [
            {
              id: 1,
              question: 'test',
              answer: 'test',
              is_save: false,
            },
          ],
        });
      }),
      connectToMaterial: jest
        .fn()
        .mockImplementation((u_id, c_id, m_id) => {
          if (!u_id || !c_id || !m_id) {
            return Promise.reject(new Error('Error'));
          }
          return Promise.resolve('create success');
        }),
      question: jest
        .fn()
        .mockImplementation((id, message) => {
          if (!id || !message) {
            return Promise.reject(new Error('Error'));
          }
          return Promise.resolve({
            message: 'test',
          });
        }),
      getSavedMessages: jest
        .fn()
        .mockImplementation((id) => {
          if (!id) {
            return Promise.reject(new Error('Error'));
          }
          return Promise.resolve([
            {
              id: 1,
              answer: 'test1',
              is_save: true,
            },
            {
              id: 2,
              answer: 'test2',
              is_save: true,
            },
          ]);
        }),
      saveMessage: jest
        .fn()
        .mockImplementation((m_id, is_save) => {
          if (!m_id || is_save === undefined) {
            return Promise.reject(new Error('Error'));
          }
          return Promise.resolve('save success');
        }),
    };

    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [PromptController],
        imports: [JwtModule, PrismaModule],
        providers: [
          {
            provide: PromptService,
            useValue: mockService,
          },
          AuthService,
        ],
      }).compile();

    controller = module.get<PromptController>(
      PromptController,
    );
    service = module.get<PromptService>(PromptService);
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

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get a prompt', async () => {
    const id = 1n;
    const prompt = await controller.get(id, 1, 1);
    expect(prompt).toEqual({
      id: 1,
      message: 'test',
      prompts: [
        {
          id: 1,
          question: 'test',
          answer: 'test',
          is_save: false,
        },
      ],
    });
  });

  it('should create a new prompt', async () => {
    const u_id = 1n;
    const c_id = 2n;
    const m_id = 3n;
    const prompt = await controller.create(
      u_id,
      { m_id },
      c_id,
    );
    expect(service.connectToMaterial).toHaveBeenCalledWith(
      u_id,
      c_id,
      m_id,
    );
    expect(prompt).toEqual('create success');
  });

  it('should create a question', async () => {
    const id = 1n;
    const message = 'Test Question';
    const response = mockResponse();
    const question = await controller.question(
      id,
      {
        message,
      },
      response,
    );
    expect(service.question).toHaveBeenCalledWith(
      id,
      message,
    );
    expect(question).toEqual({
      message: 'test',
    });
  });

  it('should get saved messages', async () => {
    const id = 1n;
    const messages = await controller.getSavedMessages(id);
    expect(service.getSavedMessages).toHaveBeenCalledWith(
      id,
    );
    expect(messages).toEqual([
      {
        id: 1,
        answer: 'test1',
        is_save: true,
      },
      {
        id: 2,
        answer: 'test2',
        is_save: true,
      },
    ]);
  });

  it('should save a message', async () => {
    const m_id = 1n;
    const is_save = true;
    const result = await controller.saveMessage(
      m_id,
      is_save,
    );
    expect(service.saveMessage).toHaveBeenCalledWith(
      m_id,
      is_save,
    );
    expect(result).toBe('save success');
  });

  it('should fail to get a prompt when id is missing', async () => {
    try {
      await controller.get(null, 1, 1);
    } catch (e) {
      expect(e.message).toBe('Error');
    }
  });

  it('should fail to create a new prompt when u_id, c_id or m_id is missing', async () => {
    try {
      await controller.create(null, { m_id: 3n }, 2n);
    } catch (e) {
      expect(e.message).toBe('Error');
    }
  });

  it('should fail to create a question when id or message is missing', async () => {
    try {
      const response = mockResponse();
      await controller.question(
        null,
        {
          message: 'Test Question',
        },
        response,
      );
    } catch (e) {
      expect(e.message).toBe('Error');
    }
  });

  it('should fail to get saved messages when id is missing', async () => {
    try {
      await controller.getSavedMessages(null);
    } catch (e) {
      expect(e.message).toBe('Error');
    }
  });

  it('should fail to save a message when m_id or is_save is missing', async () => {
    try {
      await controller.saveMessage(null, true);
    } catch (e) {
      expect(e.message).toBe('Error');
    }
  });
});
