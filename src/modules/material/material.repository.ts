import { PrismaService } from '@modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Material } from '@prisma/client';

@Injectable()
export class MaterialRepository {
  constructor(private readonly prisma: PrismaService) {}

  findOne(id: bigint) {
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

  getByCid(
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

  create(
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

  nameUpdate(id: bigint, name: string): Promise<Material> {
    return this.prisma.material.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });
  }

  async remove(id: bigint): Promise<Material> {
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

  fileUpdate(id: bigint, m_path: string, v_path: string) {
    return this.prisma.$transaction([
      this.prisma.file.delete({
        where: { f_id: id },
      }),
      this.prisma.material.update({
        where: { id: id },
        data: { file: { create: { m_path, v_path } } },
      }),
    ]);
  }
}
