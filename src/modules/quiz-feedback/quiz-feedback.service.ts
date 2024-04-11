import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { QuizFeedbackRepository } from './quiz-feedback.repository';

@Injectable()
export class QuizFeedbackService {
  constructor(
    private readonly quizFeedbackRepository: QuizFeedbackRepository,
  ) {}

  /**
   * ユーザーIDでフィードバックを取得
   * @param u_id - ユーザーID
   * @param c_id - クラスID
   * @param m_id - マテリアルID
   * @returns フィードバック
   */
  async getFeedback(
    u_id: bigint,
    c_id: bigint,
    m_id: bigint,
  ) {
    const feedback =
      await this.quizFeedbackRepository.findOne(
        u_id,
        c_id,
        m_id,
      );

    if (!feedback) {
      throw new NotFoundException('Feedback not found');
    }
  }

  /**
   * フィードバックを取得
   * @param m_id - マテリアルID
   * @param page - ページ
   * @param limit - リミット
   * @returns フィードバック
   */
  getFeedbacks(m_id: bigint, page: number, limit: number) {
    return this.quizFeedbackRepository.findMany(
      m_id,
      page,
      limit,
    );
  }

  /**
   * ニックネームでフィードバックを取得
   * @param nickname - ニックネーム
   * @param m_id - マテリアルID
   * @param page - ページ
   * @param limit - リミット
   * @returns フィードバック
   */
  getFeedbacksByNickname(
    m_id: bigint,
    nickname: string,
    page: number,
    limit: number,
  ) {
    return this.quizFeedbackRepository.findManyByNickname(
      m_id,
      nickname,
      page,
      limit,
    );
  }

  /**
   * フィードバックを作成
   * @param u_id - ユーザーID
   * @param c_id - クラスID
   * @param m_id - マテリアルID
   * @param content - コンテンツ
   * @returns フィードバック作成成功メッセージ
   */
  async createFeedback(
    u_id: bigint,
    c_id: bigint,
    m_id: bigint,
    content: string,
  ) {
    const [isSolved, isExist] = await Promise.all([
      this.quizFeedbackRepository.isSolved(
        u_id,
        c_id,
        m_id,
      ),
      this.quizFeedbackRepository.isExist(u_id, c_id, m_id),
    ]);

    if (!isSolved) {
      throw new BadRequestException(
        'The quiz has not been solved yet',
      );
    }

    if (isExist) {
      throw new ConflictException(
        'The feedback already exists',
      );
    }

    await this.quizFeedbackRepository.create(
      u_id,
      c_id,
      m_id,
      content,
    );

    return 'Feedback created successfully';
  }

  /**
   * フィードバックを更新
   * @param u_id - ユーザーID
   * @param c_id - クラスID
   * @param m_id - マテリアルID
   * @param content - コンテンツ
   * @returns フィードバック更新成功メッセージ
   */
  async updateFeedback(
    u_id: bigint,
    c_id: bigint,
    m_id: bigint,
    content: string,
  ) {
    await this.getFeedback(u_id, c_id, m_id);

    await this.quizFeedbackRepository.update(
      u_id,
      c_id,
      m_id,
      content,
    );

    return 'Feedback updated successfully';
  }

  /**
   * フィードバックを削除
   * @param u_id - ユーザーID
   * @param c_id - クラスID
   * @param m_id - マテリアルID
   * @returns - なし
   */
  async deleteFeedback(
    u_id: bigint,
    c_id: bigint,
    m_id: bigint,
  ) {
    await this.getFeedback(u_id, c_id, m_id);

    await this.quizFeedbackRepository.remove(
      u_id,
      c_id,
      m_id,
    );
  }
}
