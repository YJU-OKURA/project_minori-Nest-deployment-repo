import { PrismaService } from '@modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Material } from '@prisma/client';

@Injectable()
export class MaterialRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string): Promise<Material | null> {
    return this.prisma.material.findUnique({
      where: {
        id: BigInt(id),
      },
    });
  }

  async getByCid(
    c_id: string,
    page: number,
    limit: number,
  ): Promise<Material[] | null> {
    return this.prisma.material.findMany({
      where: {
        c_id: BigInt(c_id),
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async countByCid(c_id: string): Promise<number> {
    return this.prisma.material.count({
      where: {
        c_id: BigInt(c_id),
      },
    });
  }

  async create(
    name: string,
    u_id: string,
    c_id: string,
    m_path: string,
    v_path: string,
  ): Promise<Material> {
    return this.prisma.material.create({
      data: {
        name,
        m_path,
        v_path,
        class_user: {
          connect: {
            u_id_c_id: {
              u_id: BigInt(u_id),
              c_id: BigInt(c_id),
            },
          },
        },
      },
    });
  }

  async update(
    id: string,
    name: string,
    m_path: string,
    v_path: string,
  ): Promise<Material> {
    return this.prisma.material.update({
      where: {
        id: BigInt(id),
      },
      data: {
        name,
        m_path,
        v_path,
      },
    });
  }

  async delete(id: string): Promise<Material> {
    return this.prisma.material.delete({
      where: {
        id: BigInt(id),
      },
    });
  }
}
