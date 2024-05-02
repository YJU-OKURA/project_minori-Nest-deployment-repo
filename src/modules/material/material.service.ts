import { UploadService } from '@modules/material/upload/upload.service';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { MaterialRepository } from './material.repository';
import { LangchainService } from '@modules/material/langchain/langchain.service';
import { MaterialEntity } from './entity/material.entity';

@Injectable()
export class MaterialService {
  constructor(
    private readonly materialRepository: MaterialRepository,
    private readonly uploadService: UploadService,
    private readonly langchainService: LangchainService,
  ) {}

  /**
   * マテリアルを取得
   * @param id - マテリアルのID
   * @returns - MaterialEntity
   */
  async get(id: bigint): Promise<MaterialEntity> {
    const material = await this.materialRepository.findOne(
      id,
    );
    if (!material) {
      throw new NotFoundException(
        'there is no material with the provided id',
      );
    }
    return new MaterialEntity(material);
  }

  /**
   * クラスIDによってマテリアルを取得
   * ページネーションが適用されます。
   * @param c_id - クラスID
   * @param page - 取得するページ番号
   * @param limit - 1ページあたりのマテリアル数
   * @returns - MaterialEntityの配列
   */
  async getByCid(
    u_id: bigint,
    c_id: bigint,
    page: number,
    limit: number,
  ): Promise<MaterialEntity[]> {
    const materials =
      await this.materialRepository.getByCid(
        u_id,
        c_id,
        page,
        limit,
      );
    return materials.map(
      (material) => new MaterialEntity(material),
    );
  }

  /**
   * マテリアルを作成
   * @param name - マテリアルの名前
   * @param c_id - クラスID
   * @param file - アップロードするファイル
   * @returns - Success message
   */
  async create(
    name: string,
    c_id: bigint,
    file: Express.Multer.File,
  ): Promise<string> {
    const { m_path, v_path } =
      await this.uploadAndVectorize(String(c_id), file);
    await this.materialRepository.create(
      name,
      c_id,
      m_path,
      v_path,
    );
    return 'Material created successfully';
  }

  /**
   * マテリアルを変更
   * @param id - マテリアルのID
   * @param c_id - クラスID
   * @param name - マテリアルの新しい名前 (optional)
   * @param file - アップロードする新しいファイル (optional)
   * @returns - Success message
   */
  async update(
    id: bigint,
    c_id: bigint,
    name: string = undefined,
    file: Express.Multer.File = undefined,
  ): Promise<string> {
    if (!name && !file) {
      throw new BadRequestException(
        'name or file is required to update material',
      );
    }
    if (file) {
      await this.updateFile(id, c_id, file);
    }
    if (name) {
      await this.materialRepository.nameUpdate(id, name);
    }

    return 'Material updated successfully';
  }

  /**
   * ファイルを変更
   * @param id - マテリアルのID
   * @param c_id - クラスID
   * @param file - アップロードする新しいファイル
   * @returns - Paths of uploaded and vectorized files
   */
  private async updateFile(
    id: bigint,
    c_id: bigint,
    file: Express.Multer.File,
  ) {
    const { m_path, v_path } =
      await this.uploadAndVectorize(String(c_id), file);

    const material = await this.materialRepository.findOne(
      id,
    );

    try {
      await this.materialRepository.fileUpdate(
        id,
        m_path,
        v_path,
      );
    } catch {
      await this.deleteFile(m_path, v_path);
      throw new InternalServerErrorException(
        'file update failed',
      );
    }

    await this.deleteFile(
      material.file.m_path,
      material.file.v_path,
    );

    return { m_path, v_path };
  }

  /**
   * ファイルをアップロードし、ベクトル化
   * @param c_id - クラスID
   * @param file - アップロードするファイル
   * @returns - Paths of uploaded and vectorized files
   */
  private async uploadAndVectorize(
    c_id: string,
    file: Express.Multer.File,
  ) {
    const [v_pathResult, m_pathResult] =
      await Promise.allSettled([
        this.langchainService.vectorCreate(file, c_id),
        this.uploadService.uploadToS3(file, c_id),
      ]);

    if (v_pathResult.status === 'rejected') {
      await this.rollbackS3Upload(m_pathResult);
      throw new InternalServerErrorException(
        v_pathResult.reason.message,
      );
    }

    if (m_pathResult.status === 'rejected') {
      await this.rollbackVectorCreation(v_pathResult);
      throw new InternalServerErrorException(
        m_pathResult.reason.message,
      );
    }

    return {
      m_path: m_pathResult.value,
      v_path: v_pathResult.value,
    };
  }

  /**
   * S3アップロードをロールバック
   * @param m_pathResult - S3アップロード結果
   */
  private async rollbackS3Upload(
    m_pathResult: PromiseSettledResult<string>,
  ) {
    if (m_pathResult.status === 'fulfilled') {
      await this.uploadService.deleteFileFromS3(
        m_pathResult.value,
      );
    }
  }

  /**
   * ベクター生成をロールバック
   * @param v_pathResult - ベクター生成結果
   */
  private async rollbackVectorCreation(
    v_pathResult: PromiseSettledResult<string>,
  ) {
    if (v_pathResult.status === 'fulfilled') {
      await this.uploadService.deleteFileFromLocal(
        v_pathResult.value,
      );
    }
  }

  /**
   * マテリアルを削除
   * @param id - マテリアルのID
   * @returns - Success message
   */
  async remove(id: bigint): Promise<string> {
    const material = await this.materialRepository.findOne(
      id,
    );
    if (!material) {
      throw new NotFoundException(
        'there is no material with the provided id',
      );
    }
    await this.deleteFile(
      material.file.m_path,
      material.file.v_path,
    );
    await this.materialRepository.remove(id);
    return 'Material deleted successfully';
  }

  /**
   * ファイルを削除
   * @param id - マテリアルのID
   * @returns - void
   */
  private async deleteFile(m_path: string, v_path: string) {
    await this.uploadService.deleteFileFromS3(m_path);
    await this.uploadService.deleteFileFromLocal(v_path);
  }

  async search(
    u_id: bigint,
    c_id: bigint,
    name: string,
    page: number,
    limit: number,
  ) {
    const materials = await this.materialRepository.search(
      u_id,
      c_id,
      name,
      page,
      limit,
    );
    return materials.map(
      (material) => new MaterialEntity(material),
    );
  }
}
