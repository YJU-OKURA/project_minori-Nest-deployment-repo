import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MaterialFeedbackRepository } from './material-feedback.repository';
import { ReferRepository } from '@modules/refer/refer.repository';
import { LangchainService } from './langchain/langchain.service';
import { FileService } from './file/file.service';
import { Response } from 'express';

@Injectable()
export class MaterialFeedbackService {
  constructor(
    private readonly materialFeedbackRepository: MaterialFeedbackRepository,
    private readonly referRepository: ReferRepository,
    private readonly langchainService: LangchainService,
    private readonly fileService: FileService,
  ) {}

  /**
   * マテリアルIDによってフィードバックを取得
   * @param m_id - マテリアルのID
   * @param page - 取得するページ番号
   * @param limit - 1ページあたりのアイテム数
   * @returns フィードバック
   */
  async getByMid(
    m_id: bigint,
    page: number,
    limit: number,
  ) {
    return this.materialFeedbackRepository.getByMid(
      m_id,
      page,
      limit,
    );
  }

  /**
   * マテリアルIDに関連したキーワードを取得
   * @param m_id - マテリアルのID
   * @returns キーワード
   */
  async getKeyword(m_id: bigint) {
    const refers = await this.referRepository.getByMid(
      m_id,
    );

    if (refers.length === 0)
      throw new NotFoundException('No refer found');

    const topRefers = this.getTopThreeReference(refers);

    return this.langchainService.getKeyword(topRefers);
  }

  /**
   * マテリアルIDよってフィードバックを取得し、ストリーミング
   * @param m_id - マテリアルのID
   * @param response - レスポンスオブジェクト
   * @returns - なし
   */
  async getFeedback(m_id: bigint, response: Response) {
    const [refers, filePathResult] = await Promise.all([
      this.getRefers(m_id),
      this.materialFeedbackRepository.getFilePath(m_id),
    ]);

    const { m_path } = filePathResult;

    const file = await this.fileService.getFileFromS3(
      m_path,
    );

    const document =
      await this.langchainService.getDocument(file);

    if (!refers) {
      const allContents = document
        .map(
          (doc, i) =>
            `\n\n ${i + 1} 페이지의 내용 \n ${doc}`,
        )
        .join('\n\n');

      return this.langchainService.materialFeedback(
        allContents,
        response,
      );
    } else {
      const [mostReferedPage, referedContents] =
        this.findMostRefer(refers);

      const pageContent = document[mostReferedPage - 1];

      return this.langchainService.pageFeedback(
        mostReferedPage,
        pageContent,
        referedContents,
        response,
      );
    }
  }

  /**
   * 新たなフィードバックを作成
   * @param m_id - マテリアルのID
   * @param content - フィードバックの内容
   * @returns 作成されたフィードバックの情報
   */
  create(m_id: bigint, content: string) {
    return this.materialFeedbackRepository.create(
      m_id,
      content,
    );
  }

  /**
   * フィードバックを削除
   * @param id - 削除するフィードバックのID
   * @returns - Success message
   */
  remove(id: bigint) {
    return this.materialFeedbackRepository.remove(id);
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
   * 最も多く参照されたページとその内容を取得
   * @param refers - 参照データ
   * @returns 最も参照されたページの番号と、そのページに関する内容の組み合わせの配列
   */
  private findMostRefer(
    refers: { page: number; content: string }[],
  ): [number, string] {
    const pageCounts = refers.reduce((acc, { page }) => {
      acc[page] = (acc[page] || 0) + 1;
      return acc;
    }, {});

    const mostReferedPage = Object.keys(pageCounts).reduce(
      (a, b) => (pageCounts[a] > pageCounts[b] ? a : b),
    );

    const contents = refers
      .map((refer) =>
        refer.page.toString() === mostReferedPage
          ? refer.content
          : '',
      )
      .filter(
        (content, index, self) =>
          self.indexOf(content) === index,
      )
      .join('\n - ');

    return [parseInt(mostReferedPage), contents];
  }

  /**
   * トップ3の最も多く参照されたページとその内容を取得
   * @param refers - 参照データ
   * @returns トップ3の参照ページとその内容のオブジェクトのJSON文字列
   */
  private getTopThreeReference(
    refers: { page: number; content: string }[],
  ) {
    const pageReferenceCount = refers.reduce(
      (acc, { page, content }) => {
        if (!acc[page])
          acc[page] = { count: 1, contents: [content] };
        else {
          acc[page].count++;
          if (!acc[page].contents.includes(content))
            acc[page].contents.push(content);
        }
        return acc;
      },
      {},
    );

    const topThreePages = Object.entries<{
      count: number;
      contents: string[];
    }>(pageReferenceCount)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, 3);

    return JSON.stringify(
      topThreePages.map(([page, data]) => ({
        page: parseInt(page),
        contents: data.contents,
      })),
    );
  }
}
