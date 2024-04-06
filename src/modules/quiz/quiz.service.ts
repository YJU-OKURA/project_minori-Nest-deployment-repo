import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { QuizRepository } from './quiz.repository';
import { FileService } from '@modules/file/file.service';
import { LangchainService } from './langchain/langchain.service';
import { ReferRepository } from '@modules/refer/refer.repository';
import {
  CreateUpdateQuizDto,
  QuizContent,
} from './dto/create-update.dto';
import { QuizEntity } from './entity/quiz.entity';

@Injectable()
export class QuizService {
  constructor(
    private readonly quizRepository: QuizRepository,
    private readonly fileService: FileService,
    private readonly langchainService: LangchainService,
    private readonly referRepository: ReferRepository,
  ) {}

  /**
   * マテリアルIDによってクイズを取得
   * @param m_id - マテリアルID
   * @param page - ページ番号
   * @param limit - 1ページあたりのアイテム数
   * @returns - クイズ
   */
  async getByMid(
    m_id: bigint,
    page: number,
    limit: number,
  ) {
    const quizzes = await this.quizRepository.getByMid(
      m_id,
      page,
      limit,
    );

    if (!quizzes) {
      throw new NotFoundException(
        'there is no quizzes with the provided id',
      );
    }

    return quizzes.map(
      (quiz) =>
        new QuizEntity({
          id: quiz.id,
          content: JSON.parse(quiz.content as string),
        }),
    );
  }

  /**
   * LLMによってクイズを取得
   * @param m_id - マテリアルID
   * @returns - クイズ
   */
  async getQuizByLLM(m_id: bigint) {
    const [refers, filePathResult] = await Promise.all([
      this.getRefers(m_id),
      this.quizRepository.getFilePath(m_id),
    ]);

    if (!filePathResult) {
      throw new NotFoundException('File not found');
    }

    const file = await this.fileService.getFileFromS3(
      filePathResult.m_path,
    );

    const document =
      await this.langchainService.getDocument(file);

    const pageNumbers = refers
      ? this.getReferedPageNumbers(document, refers)
      : this.getRandomPageNumbers(document.length);

    const pages = this.getPages(document, pageNumbers);

    const contents = pages.map((doc) => doc).join('\n\n');

    return await this.langchainService.getQuiz(contents);
  }

  /**
   * 参照されたページ番号を取得
   * @param document - ドキュメント
   * @param refers - 参照データ
   * @returns - ページ番号の配列
   */
  private getReferedPageNumbers(
    document: string[],
    refers: { page: number; content: string }[],
  ) {
    const MAX_REFER_COUNT = 7;
    const mostReferedPage =
      this.findMostReferedPage(refers);

    // ページの範囲を取得
    let pageNumbers = [
      mostReferedPage - 3,
      mostReferedPage - 2,
      mostReferedPage - 1,
      mostReferedPage,
      mostReferedPage + 1,
      mostReferedPage + 2,
      mostReferedPage + 3,
    ];

    if (document.length <= MAX_REFER_COUNT) {
      pageNumbers = [];
      for (let i = 0; i < document.length; i++) {
        pageNumbers.push(i);
      }
      return pageNumbers;
    }
    // ドキュメントの始まりの処理
    else if (mostReferedPage === 1) {
      pageNumbers = pageNumbers.map(
        (pageNumber, i) => mostReferedPage + i,
      );
    }
    // ドキュメントの終わりの処理
    else if (mostReferedPage >= document.length - 1) {
      pageNumbers = pageNumbers.map(
        (pageNumber, i) =>
          mostReferedPage - MAX_REFER_COUNT + i,
      );
    }
    // ページ番号をドキュメントの範囲内に調整
    pageNumbers = pageNumbers.map((page) =>
      Math.max(0, Math.min(page, document.length - 1)),
    );

    return pageNumbers;
  }

  /**
   * クイズを更新
   * @param id - クイズID
   * @param content - クイズの内容
   * @returns - 更新されたクイズ
   */
  async update(id: bigint, content: CreateUpdateQuizDto) {
    const quiz = await this.quizRepository.update(
      id,
      JSON.stringify(content.content),
    );
    return new QuizEntity({
      id: quiz.id,
      content: JSON.parse(quiz.content as string),
    });
  }

  /**
   * クイズを削除
   * @param id - 削除するクイズのID
   * @returns - void
   */
  remove(id: bigint) {
    return this.quizRepository.remove(id);
  }

  /**
   * マテリアルIDよって参照データを取得
   * @param m_id - マテリアルID
   * @returns 取得した参照の配列があればその配列を、なければundefined
   */
  private async getRefers(m_id: bigint) {
    const refer = await this.referRepository.getByMid(m_id);
    return refer.length ? refer : undefined;
  }

  /**
   * クイズを作成
   * @param m_id - マテリアルID
   * @param content - クイズの内容
   * @returns - 作成されたクイズ
   */
  async create(m_id: bigint, content: QuizContent) {
    await this.quizRepository.create(
      m_id,
      JSON.stringify(content),
    );
    return 'Quiz created successfully';
  }

  /**
   * ページの内容を取得
   * @param document - ドキュメント
   * @param pageNumbers - ページ番号の配列
   * @returns - ページの内容の配列
   */
  private getPages(
    document: string[],
    pageNumbers: number[],
  ) {
    const pages: string[] = [];

    for (const pageNumber of pageNumbers) {
      pages.push(document[pageNumber]);
    }

    return pages;
  }

  /**
   * ランダムにページ番号を取得
   * @param documentLength - ドキュメントの長さ
   * @returns - ページ番号の配列
   */
  private getRandomPageNumbers(documentLength: number) {
    const STANDARD_PAGE_LENGTH = 7;
    const randomPageNumbers: number[] = [];

    if (documentLength <= STANDARD_PAGE_LENGTH) {
      for (let i = 0; i < documentLength; i++) {
        randomPageNumbers.push(i);
      }
      return randomPageNumbers;
    }

    const randomPageNumber = Math.floor(
      Math.random() *
        (documentLength - STANDARD_PAGE_LENGTH),
    );

    for (let i = 0; i < STANDARD_PAGE_LENGTH; i++) {
      randomPageNumbers.push(randomPageNumber + i);
    }
    return randomPageNumbers;
  }

  /**
   * 一番多く参照されたページを取得
   * @param refers - 参照データ
   * @returns - 一番多く参照されたページの番号
   */
  private findMostReferedPage(
    refers: { page: number; content: string }[],
  ): number {
    const pageCounts = refers.reduce((acc, { page }) => {
      acc[page] = (acc[page] || 0) + 1;
      return acc;
    }, {});

    const mostReferedPage = Object.keys(pageCounts).reduce(
      (a, b) => (pageCounts[a] > pageCounts[b] ? a : b),
    );

    return parseInt(mostReferedPage);
  }
}
