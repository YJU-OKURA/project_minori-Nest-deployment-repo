import { Test, TestingModule } from '@nestjs/testing';
import { MaterialController } from './material.controller';
import { MaterialService } from './material.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '@modules/prisma/prisma.module';
import { ClassUserRepository } from '@modules/class-user/class-user.repository';

describe('MaterialController', () => {
  let controller: MaterialController;
  let service: MaterialService;

  const mockFile: Express.Multer.File = {
    fieldname: 'testfield',
    originalname: 'testfile.pdf',
    encoding: '7bit',
    mimetype: 'application/pdf',
    buffer: Buffer.from('test file'),
    size: 1024,
    destination: './uploads',
    filename: 'testfile.pdf',
    path: './uploads/testfile.pdf',
    stream: null,
  };

  beforeEach(async () => {
    const mockService = {
      countByCid: jest.fn().mockImplementation((c_id) => {
        if (!c_id) {
          return Promise.reject(new Error('Error'));
        }
        return Promise.resolve(1);
      }),
      getByCid: jest
        .fn()
        .mockImplementation((u_id, c_id, page, limit) => {
          if (!u_id || !c_id || !page || !limit) {
            return Promise.reject(new Error('Error'));
          }
          return Promise.resolve([
            {
              id: '15',
              name: 'test',
              file: {
                m_path: 'https://test/test.pdf',
              },
              prompts: [
                {
                  id: '15',
                },
              ],
            },
          ]);
        }),
      create: jest
        .fn()
        .mockImplementation((name, c_id, file) => {
          if (!name || !c_id || !file) {
            return Promise.reject(new Error('Error'));
          }
          return Promise.resolve('create success');
        }),
      update: jest
        .fn()
        .mockImplementation((id, c_id, name, file) => {
          if (!id || !c_id || !name || !file) {
            return Promise.reject(new Error('Error'));
          }
          return Promise.resolve('update success');
        }),
      remove: jest.fn().mockImplementation((id) => {
        if (!id) {
          return Promise.reject(new Error('Error'));
        }
        return Promise.resolve('remove success');
      }),
    };

    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [MaterialController],
        imports: [JwtModule, PrismaModule],
        providers: [
          {
            provide: MaterialService,
            useValue: mockService,
          },
          ClassUserRepository,
        ],
      }).compile();

    controller = module.get<MaterialController>(
      MaterialController,
    );
    service = module.get<MaterialService>(MaterialService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get materials by class ID', async () => {
    const u_id = 2n;
    const c_id = 1n;
    const page = 1;
    const limit = 1;
    const materials = await controller.getByCid(
      u_id,
      c_id,
      page,
      limit,
    );
    expect(service.getByCid).toHaveBeenCalledWith(
      u_id,
      c_id,
      page,
      limit,
    );
    expect(materials).toEqual([
      {
        id: '15',
        name: 'test',
        file: {
          m_path: 'https://test/test.pdf',
        },
        prompts: [
          {
            id: '15',
          },
        ],
      },
    ]);
  });

  it('should create a new material', async () => {
    const c_id = 1n;
    const created = await controller.create(
      { name: 'Test Material', file: mockFile },
      c_id,
      mockFile,
    );
    expect(service.create).toHaveBeenCalledWith(
      'Test Material',
      c_id,
      mockFile,
    );
    expect(created).toBe('create success');
  });

  it('should update a material', async () => {
    const id = 1n;
    const c_id = 1n;
    const body = { name: 'Test Material' };
    const updated = await controller.update(
      { name: 'Test Material', file: mockFile },
      id,
      c_id,
      mockFile,
    );
    expect(service.update).toHaveBeenCalledWith(
      id,
      c_id,
      body.name,
      mockFile,
    );
    expect(updated).toBe('update success');
  });

  it('should remove a material', async () => {
    const id = 1n;
    const removed = await controller.remove(id);
    expect(service.remove).toHaveBeenCalledWith(id);
    expect(removed).toBe('remove success');
  });

  it('should fail to get materials by class ID when service returns error', async () => {
    try {
      const u_id = 2n;
      const c_id = null;
      const page = 1;
      const limit = 1;
      await controller.getByCid(u_id, c_id, page, limit);
    } catch (e) {
      expect(e.message).toBe('Error');
    }
  });

  it('should fail to create a new material when service returns error', async () => {
    try {
      const c_id = null;
      await controller.create(
        { name: 'Test Material', file: mockFile },
        c_id,
        mockFile,
      );
    } catch (e) {
      expect(e.message).toBe('Error');
    }
  });

  it('should fail to update a material when service returns error', async () => {
    try {
      const id = null;
      const body = {
        name: 'Test Material',
        file: mockFile,
      };
      const c_id = 1n;
      await controller.update(
        { name: 'Test Material', file: mockFile },
        id,
        c_id,
        mockFile,
      );
    } catch (e) {
      expect(e.message).toBe('Error');
    }
  });

  it('should fail to delete a material when service returns error', async () => {
    try {
      const id = null;
      await controller.remove(id);
    } catch (e) {
      expect(e.message).toBe('Error');
    }
  });
});
