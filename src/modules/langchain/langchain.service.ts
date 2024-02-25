import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LangchainConfig } from '@common/configs/config.interface';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { TokenTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from '@langchain/openai';
import { FaissStore } from '@langchain/community/vectorstores/faiss';
import { Document } from '@langchain/core/documents';

@Injectable()
export class LangchainService {
  private readonly langchainConfig: LangchainConfig;

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.langchainConfig =
      this.configService.get<LangchainConfig>('langchain');
  }

  /**
   * ファイルからベクトルを作成し、そのパスをリターン
   * @param file - ベクトルを作成するファイル
   * @param c_id - クラスID
   * @returns - 作成したベクトルのパス
   */
  async vectorCreate(
    file: Express.Multer.File,
    c_id: string,
  ): Promise<string> {
    let blob: Blob;
    try {
      blob = new Blob([file.buffer]);
    } catch (error) {
      throw new InternalServerErrorException(
        'Blob creation failed',
      );
    }

    let docs: Document[];
    try {
      docs = await this.splitDocument(blob);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to split document',
      );
    }

    const path = `${
      this.langchainConfig.localStoragePath
    }/class${c_id}/${new Date().getTime()}`;

    try {
      await this.saveVector(docs, path);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to save vector',
      );
    }

    return path;
  }

  /**
   * ドキュメントを分割
   * @param blob - 分割するドキュメント
   * @returns - 分割されたドキュメント
   */
  private async splitDocument(
    blob: Blob,
  ): Promise<Document[]> {
    const loader = new PDFLoader(blob);
    const pages = await loader.loadAndSplit();

    const splitter = new TokenTextSplitter({
      encodingName: 'cl100k_base',
      chunkSize: 500,
      chunkOverlap: 100,
    });

    return await splitter.splitDocuments(pages);
  }

  /**
   * ベクトルを保存
   * @param docs - ベクトルを作成するドキュメント
   * @param path - 保存するパス
   */
  private async saveVector(
    docs: Document[],
    path: string,
  ): Promise<void> {
    const embeddingsModel = new OpenAIEmbeddings({
      openAIApiKey:
        this.configService.get<string>('openAIApiKey'),
    });

    const db = await FaissStore.fromDocuments(
      docs,
      embeddingsModel,
    );
    await db.save(path);
  }
}
