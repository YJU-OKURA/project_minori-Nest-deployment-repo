import {
  BadRequestException,
  ConflictException,
  GoneException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SetQuizRepository } from './set-quiz.repository';
import { MAX_QUIZ_DATA_SIZE } from './dto/create.dto';
import { QuizEntity } from '@modules/quiz/entity/quiz.entity';
import { QuizResult } from './dto/mark.dto';
import { ClassUserRepository } from '@modules/class-user/class-user.repository';
import { QuizContent } from '@modules/quiz/dto/create-update.dto';

@Injectable()
export class SetQuizService {
  constructor(
    private readonly setQuizRepository: SetQuizRepository,
    private readonly classUserRepository: ClassUserRepository,
  ) {}

  /**
   * クイズセットを取得
   * @param m_id - マテリアルID
   * @returns - クイズセット
   */
  async get(m_id: bigint) {
    const quizSet =
      await this.setQuizRepository.getSettedQuizzesByMId(
        m_id,
      );

    if (!quizSet) {
      throw new NotFoundException();
    }

    return {
      deadline: quizSet.deadline,
      quizList: quizSet.quizLists.map(
        (q) =>
          new QuizEntity({
            id: q.q_id,
            content: q.quiz.content,
          }),
      ),
    };
  }

  /**
   * クイズ採点
   * @param c_id - クラスID
   * @param u_id - ユーザーID
   * @param m_id - マテリアルID
   * @param created_at - 作成日
   * @param results - クイズ結果
   * @returns - クイズ採点結果
   */
  async mark(
    c_id: bigint,
    u_id: bigint,
    m_id: bigint,
    created_at: Date,
    results: QuizResult[],
  ) {
    await this.checkBeforeMark(
      m_id,
      u_id,
      created_at,
      results,
    );

    await this.setQuizRepository.mark(
      results.map((d) => ({
        c_id,
        u_id,
        s_id: m_id,
        created_at,
        ...d,
      })),
    );

    return 'quiz marked successfully';
  }

  /**
   * 採点の前にデッドライン、クイズ数、クイズIDを確認
   * @param m_id - マテリアルID
   * @param created_at - 作成日
   * @param data - クイズ結果
   */
  private async checkBeforeMark(
    m_id: bigint,
    u_id: bigint,
    created_at: Date,
    data: QuizResult[],
  ) {
    const { deadline } =
      await this.setQuizRepository.getDeadline(m_id);

    if (deadline < created_at) {
      throw new GoneException('deadline passed');
    }

    const quizzes =
      await this.setQuizRepository.getQuizzesByMId(m_id);

    const quizIds = quizzes.map((q) => q.id);

    if (quizIds.length !== data.length) {
      throw new BadRequestException('quiz count mismatch');
    }
    quizIds.forEach((id) => {
      if (!data.find((d) => d.q_id === id)) {
        throw new BadRequestException('quiz id mismatch');
      }
    });

    const result =
      await this.setQuizRepository.getResultByUId(
        u_id,
        m_id,
      );

    if (result.length !== 0) {
      throw new ConflictException('quiz already marked');
    }
  }

  /**
   * クイズ掲示の前にデータ数、クイズIDを確認
   * @param m_id
   * @param data
   */
  private async checkBeforePost(
    m_id: bigint,
    data: bigint[],
    isUpdate = false,
  ) {
    if (
      data.length === 0 ||
      data.length > MAX_QUIZ_DATA_SIZE
    ) {
      throw new BadRequestException(
        `quiz count should be between 1 and ${MAX_QUIZ_DATA_SIZE}`,
      );
    }

    const quizzes =
      await this.setQuizRepository.getQuizzesByMId(m_id);

    const quizIds = quizzes.map((q) => q.id);

    data.forEach((q_id) => {
      if (!quizIds.find((id) => id === q_id)) {
        throw new NotFoundException(
          'there is no quiz with the provided id',
        );
      }
    });

    if (isUpdate) {
      let isSame = true;
      const previousQuizSet =
        await this.setQuizRepository.getSettedQuizzesByMId(
          m_id,
        );

      if (
        previousQuizSet.quizLists.length !== data.length
      ) {
        isSame = false;
      } else {
        for (
          let i = 0;
          i < previousQuizSet.quizLists.length;
          i++
        ) {
          if (
            previousQuizSet.quizLists[i].q_id !== data[i]
          ) {
            isSame = false;
            break;
          }
        }
      }

      if (isSame) {
        throw new ConflictException('same quiz set');
      }
    }
  }

  /**
   * ニックネームでクイズ結果を取得
   * @param m_id - マテリアルID
   * @param nickname - ニックネーム
   * @returns - クイズ結果
   */
  async getResultByNickname(
    c_id: bigint,
    m_id: bigint,
    nickname: string,
    page: number,
    limit: number,
  ) {
    const classUsers =
      await this.classUserRepository.getClassUsersByNickname(
        c_id,
        nickname,
        page,
        limit,
      );

    return this.getClassUsersCollectRate(classUsers, m_id);
  }

  /**
   * クイズセットを掲示
   * @param m_id - マテリアルID
   * @param deadline - 提出期限
   * @param data - クイズID
   * @returns - クイズセット掲示結果
   */
  async post(m_id: bigint, deadline: Date, data: bigint[]) {
    if (
      (await this.setQuizRepository.getResultByMId(m_id))
        .length
    ) {
      throw new ConflictException('quiz already posted');
    }

    await this.checkBeforePost(m_id, data);
    await this.setQuizRepository.post(
      m_id,
      deadline,
      data.map((d) => ({ q_id: d })),
    );

    return 'set quiz posted successfully';
  }

  /**
   * クイズセットを更新
   * @param m_id - マテリアルID
   * @param deadline - 提出期限
   * @param data - クイズID
   * @returns - クイズセット更新結果
   */
  async updatePost(
    m_id: bigint,
    deadline?: Date,
    data?: bigint[],
  ) {
    if (!deadline && !data) {
      throw new BadRequestException('no data provided');
    }
    if (data) {
      await this.checkBeforePost(m_id, data, true);
    }

    await this.setQuizRepository.updatePost(
      m_id,
      deadline,
      data?.map((d) => ({ q_id: d })),
    );

    return 'set quiz updated successfully';
  }

  /**
   * ユーザーたちのクイズ結果を取得
   * @param c_id - クラスID
   * @param m_id - マテリアルID
   * @param page - ページ番号
   * @param limit - 1ページあたりのアイテム数
   * @returns - ユーザーたちのクイズ結果
   */
  async getStatisticsUsers(
    c_id: bigint,
    m_id: bigint,
    page: number,
    limit: number,
  ) {
    const classUsers =
      await this.classUserRepository.getClassUsersInfo(
        c_id,
        page,
        limit,
      );

    return this.getClassUsersCollectRate(classUsers, m_id);
  }

  /**
   * クラスのクイズ統計を取得
   * @param c_id - クラスID
   * @param m_id - マテリアルID
   * @returns - クラスのクイズ統計
   */
  async getStatisticsClass(c_id: bigint, m_id: bigint) {
    const [classUsers, results] = await Promise.all([
      this.classUserRepository.getClassUsersInfo(c_id),
      this.setQuizRepository.getResults(c_id, m_id),
    ]);

    const attendedClassUsersCount = classUsers
      .map((user) => {
        return results.filter((r) => r.u_id === user.u_id);
      })
      .filter((r) => r.length > 0).length;

    const attendRate = Math.round(
      (attendedClassUsersCount / classUsers.length) * 100,
    );

    return {
      attendRate,
      collectRate: this.getCollectRate(results),
    };
  }

  /**
   * ユーザーのクイズ結果を取得
   * @param u_id - ユーザーID
   * @param m_id - マテリアルID
   * @returns - ユーザーのクイズ結果
   */
  async getResultByUId(u_id: bigint, m_id: bigint) {
    const result =
      await this.setQuizRepository.getResultByUId(
        u_id,
        m_id,
      );

    if (result.length === 0) {
      throw new NotFoundException('no result found');
    }

    const collectRate = this.getCollectRate(result);

    const results = result.map((r) => {
      const q_id = Number(r.q_id);

      const { question } = JSON.parse(
        r.quizList.quiz.content as string,
      ) as QuizContent;

      return {
        content: {
          q_id,
          question,
        },
        result: r.result,
      };
    });

    return {
      collectRate,
      results,
    };
  }

  /**
   * クラスのユーザーたちのクイズに対しての参加率と正解率を取得
   * @param results - クイズ結果
   * @returns - 参加率と正解率
   */
  private getCollectRate(
    results: QuizResult[] | { result: boolean }[],
  ) {
    const collectedCount = results.filter(
      (r) => r.result === true,
    ).length;

    return Math.round(
      (collectedCount / results.length) * 100,
    );
  }

  private async getClassUsersCollectRate(
    classUsers: {
      u_id: bigint;
      nickname: string;
    }[],
    m_id: bigint,
  ) {
    const collectedRates = await Promise.all(
      classUsers.map(async ({ u_id }) => {
        const data =
          await this.setQuizRepository.getResultByUId(
            u_id,
            m_id,
          );

        return data.length
          ? this.getCollectRate(data)
          : 'N/A';
      }),
    );

    return collectedRates.map((rate, i) => {
      return {
        ...classUsers[i],
        collectedRate: rate,
      };
    });
  }
}
