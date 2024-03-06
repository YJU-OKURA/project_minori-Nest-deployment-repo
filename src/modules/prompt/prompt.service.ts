import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PromptRepository } from './prompt.repository';
import { LangchainService } from './langchain/langchain.service';
import { MessageRepository } from './message/message.repository';
import { ReferRepository } from './refer/refer.repository';

@Injectable()
export class PromptService {
  constructor(
    private readonly promptRepository: PromptRepository,
    private readonly langchainService: LangchainService,
    private readonly messageRepository: MessageRepository,
    private readonly referRepository: ReferRepository,
  ) {}

  /**
   * プロンプトを取得
   * @param id - プロンプトのID
   * @returns - プロンプト
   */
  get(id: bigint) {
    return this.promptRepository.findOne(id);
  }

  /**
   * 資料と連結されたプロンプト作成
   * @param u_id - ユーザーID
   * @param c_id - クラスID
   * @param m_id - 資料ID
   * @returns - 作成されたプロンプト
   */
  async connectToMaterial(
    u_id: bigint,
    c_id: bigint,
    m_id: bigint,
  ) {
    const { id } = await this.promptRepository.create(
      u_id,
      c_id,
      m_id,
    );
    return this.get(id);
  }

  /**
   * 質問に対する回答を取得
   * @param id - プロンプトのID
   * @param question - 質問
   * @returns - 回答
   */
  async question(id: bigint, question: string) {
    const { v_path, f_id } = await this.getFile(id);

    const previousMessages =
      await this.messageRepository.getPreviousMessage(id);

    const { referInfo, answer, usage } =
      await this.langchainService.question(
        v_path,
        question,
        previousMessages,
      );

    await this.promptRepository.update(id, usage);

    const message = await this.messageRepository.create(
      id,
      question,
      answer,
    );

    await this.referCreate(id, f_id, referInfo);

    return message;
  }

  /**
   * 参照情報を作成
   * @param id - プロンプトのID
   * @param f_id - ファイルID
   * @param void
   */
  async referCreate(
    id: bigint,
    f_id: bigint,
    referInfo: { page: number; content: string }[],
  ) {
    const refers = referInfo.map((refer) => {
      return {
        page: refer.page,
        content: refer.content.replace(/\0/g, ''),
        f_id,
        p_id: id,
      };
    });
    await this.referRepository.create(refers);
  }

  /**
   * ファイルを取得
   * @param id - プロンプトのID
   * @returns - ファイル情報
   */
  async getFile(id: bigint) {
    const { material } =
      await this.promptRepository.findFile(id);
    if (!material.file) {
      throw new NotFoundException(
        'there is no related file',
      );
    }
    return material.file;
  }

  /**
   * 保存されたメッセージを取得
   * @param id - プロンプトのID
   * @returns - 保存されたメッセージ
   */
  getSavedMessages(id: bigint) {
    return this.promptRepository.getSavedMessages(id);
  }

  /**
   * メッセージを保存
   * @param id - メッセージのID
   * @param isSave - 保存するかどうか
   * @returns - 成功メッセージ
   */
  async saveMessage(id: bigint, isSave: boolean) {
    await this.messageRepository.update(id, isSave);
    return 'the message has been saved';
  }
}
