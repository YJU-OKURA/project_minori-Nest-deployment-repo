import { UploadService } from '@modules/upload/upload.service';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { MaterialRepository } from './material.repository';
import { LangchainService } from '@modules/langchain/langchain.service';
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
  async get(id: string): Promise<MaterialEntity> {
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
    c_id: string,
    page: number,
    limit: number,
  ): Promise<MaterialEntity[]> {
    const materials =
      await this.materialRepository.getByCid(
        c_id,
        page,
        limit,
      );
    return materials.map(
      (material) => new MaterialEntity(material),
    );
  }

  /**
   * クラスIDによってマテリアルの総数を取得
   * @param c_id - クラスID
   * @returns - マテリアルの総数
   */
  async countByCid(c_id: string): Promise<number> {
    return this.materialRepository.countByCid(c_id);
  }

  /**
   * マテリアルを作成
   * @param name - マテリアルの名前
   * @param u_id - ユーザーID
   * @param c_id - クラスID
   * @param file - アップロードするファイル
   * @returns - Success message
   */
  async create(
    name: string,
    u_id: string,
    c_id: string,
    file: Express.Multer.File,
  ): Promise<string> {
    const { m_path, v_path } =
      await this.uploadAndVectorize(c_id, file);
    await this.materialRepository.create(
      name,
      u_id,
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
    id: string,
    c_id: string,
    name: string = undefined,
    file: Express.Multer.File = undefined,
  ): Promise<string> {
    let m_path: string,
      v_path: string = undefined;

    if (!name && !file) {
      throw new BadRequestException(
        'name or file is required to update material',
      );
    }
    if (file) {
      ({ m_path, v_path } = await this.updateFile(
        id,
        c_id,
        file,
      ));
    }
    await this.materialRepository.update(
      id,
      name,
      m_path,
      v_path,
    );

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
    id: string,
    c_id: string,
    file: Express.Multer.File,
  ) {
    const material = await this.materialRepository.findOne(
      id,
    );
    await this.deleteFile(material.m_path, material.v_path);
    return this.uploadAndVectorize(c_id, file);
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
  async delete(id: string): Promise<string> {
    const material = await this.materialRepository.findOne(
      id,
    );
    await this.deleteFile(material.m_path, material.v_path);
    await this.materialRepository.delete(id);
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
}
