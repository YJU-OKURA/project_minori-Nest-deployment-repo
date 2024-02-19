import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';
import { Prisma } from '@prisma/client';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [PrismaService],
      }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(PrismaService);

    for (const model in Prisma.ModelName) {
      expect(service).toHaveProperty(model.toLowerCase());
    }
  });
});
