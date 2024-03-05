import { PrismaService } from '@modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Material } from '@prisma/client';

@Injectable()
export class MaterialRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: bigint) {
    return this.prisma.material.findUnique({
      where: {
        id,
      },
      include: {
        file: {
          select: {
            m_path: true,
            v_path: true,
          },
        },
      },
    });
  }

  async getByCid(
    u_id: bigint,
    c_id: bigint,
    page: number,
    limit: number,
  ): Promise<Material[] | null> {
    return this.prisma.material.findMany({
      where: {
        c_id,
      },
      include: {
        file: {
          select: {
            m_path: true,
          },
        },
        prompts: {
          where: {
            u_id,
          },
          select: {
            id: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async countByCid(c_id: bigint): Promise<number> {
    return this.prisma.material.count({
      where: {
        c_id,
      },
    });
  }

  async create(
    name: string,
    u_id: bigint,
    c_id: bigint,
    m_path: string,
    v_path: string,
  ): Promise<Material> {
    return this.prisma.material.create({
      data: {
        name,
        file: {
          create: {
            m_path,
            v_path,
          },
        },
        class_user: {
          connect: {
            u_id_c_id: {
              u_id,
              c_id,
            },
          },
        },
      },
    });
  }

  async update(
    id: bigint,
    name: string,
    m_path: string,
    v_path: string,
  ): Promise<Material> {
    return this.prisma.material.update({
      where: {
        id,
      },
      data: {
        name,
        file: {
          update: {
            m_path,
            v_path,
          },
        },
      },
    });
  }

  async delete(id: bigint): Promise<Material> {
    return this.prisma.material.delete({
      where: {
        id,
      },
    });
  }

  async search(
    u_id: bigint,
    c_id: bigint,
    name: string,
    page: number,
    limit: number,
  ) {
    return this.prisma.material.findMany({
      where: {
        name: {
          contains: name,
        },
        c_id,
      },
      include: {
        file: {
          select: {
            m_path: true,
          },
        },
        prompts: {
          where: {
            u_id,
          },
          select: {
            id: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        created_at: 'desc',
      },
    });
  }
}
