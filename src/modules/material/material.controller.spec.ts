import { Test, TestingModule } from '@nestjs/testing';
import { MaterialController } from './material.controller';
import { MaterialService } from './material.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '@modules/auth/auth.service';
import { PrismaModule } from '@modules/prisma/prisma.module';

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
      countByCid: jest.fn().mockResolvedValue(1),
      get: jest.fn().mockResolvedValue({}),
      getByCid: jest.fn().mockResolvedValue([]),
      create: jest.fn().mockResolvedValue('1'),
      update: jest.fn().mockResolvedValue('1'),
      delete: jest.fn().mockResolvedValue('1'),
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
          AuthService,
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

  it('should count materials by class ID', async () => {
    const c_id = '1';
    const count = await controller.countByCid(c_id);
    expect(service.countByCid).toHaveBeenCalledWith(c_id);
    expect(count).toBe(1);
  });

  it('should get a material by ID', async () => {
    const id = '1';
    const material = await controller.get(id);
    expect(service.get).toHaveBeenCalledWith(id);
    expect(material).toEqual({});
  });

  it('should get materials by class ID', async () => {
    const c_id = '1';
    const page = 1;
    const limit = 10;
    const materials = await controller.getByCid(
      c_id,
      page,
      limit,
    );
    expect(service.getByCid).toHaveBeenCalledWith(
      c_id,
      page,
      limit,
    );
    expect(materials).toEqual([]);
  });

  it('should create a new material', async () => {
    const c_id = '1';
    const body = { name: 'Test Material' };
    const user = { id: '1', name: 'Test User' };
    const req = {
      user: { id: '1', name: 'Test User' },
    } as unknown as Request;
    const created = await controller.create(
      req,
      { name: 'Test Material', file: mockFile },
      c_id,
      mockFile,
    );
    expect(service.create).toHaveBeenCalledWith(
      'Test Material',
      user,
      c_id,
      mockFile,
    );
    expect(created).toBe('1');
  });

  it('should update a material', async () => {
    const id = '1';
    const c_id = '1';
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
    expect(updated).toBe('1');
  });

  it('should delete a material', async () => {
    const id = '1';
    const deleted = await controller.delete(id);
    expect(service.delete).toHaveBeenCalledWith(id);
    expect(deleted).toBe('1');
  });
});
