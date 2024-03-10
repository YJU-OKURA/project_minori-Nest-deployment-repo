import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LangchainConfig } from '@common/configs/config.interface';
import { OpenAIEmbeddings } from '@langchain/openai';
import { FaissStore } from '@langchain/community/vectorstores/faiss';
import { ChatOpenAI } from '@langchain/openai';
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables';
import { formatDocumentsAsString } from 'langchain/util/document';
import { ChatMessageHistory } from 'langchain/stores/message/in_memory';
import {
  HumanMessage,
  AIMessage,
  BaseMessage,
} from '@langchain/core/messages';
import { VectorStoreRetriever } from '@langchain/core/vectorstores';
import { Message } from '@prisma/client';

interface ChainResult {
  referInfo: { page: number; content: string }[];
  answer: string;
  usage: number;
}

@Injectable()
export class LangchainService {
  private readonly langchainConfig: LangchainConfig;
  private usage: number;
  private readonly NO_IDEA = 'NO IDEA.';
  private readonly NO_IDEA_MESSAGE =
    'We cannot respond as there is no data related to this material.';

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.langchainConfig =
      this.configService.get<LangchainConfig>('langchain');
  }

  /**
   * ベクトルを取得し、質問と類似度の高い部分取得。それと前回のメッセージを使って検索拡張生成（RAG）
   * @param v_path - ベクトルのパス
   * @param question - ユーザーの質問
   * @param previousMessages - 前回のメッセージ
   * @returns - 参照されたファイルの情報、GPTの回答、トークン使用量
   */
  async question(
    v_path: string,
    question: string,
    previousMessages: Message[],
  ) {
    const db = await this.loadDB(v_path);
    const chatHistory = await this.createChatHistory(
      previousMessages,
    );
    return this.runPrompt(db, question, chatHistory);
  }

  /**
   * メッセージからチャットの履歴を作成
   * @param messages - メッセージの配列
   * @returns - BaseMessageの配列
   */
  private async createChatHistory(
    messages: Message[],
  ): Promise<BaseMessage[]> {
    try {
      const history = new ChatMessageHistory();

      for (const message of messages.reverse()) {
        await Promise.all([
          history.addMessage(
            new HumanMessage(message.question),
          ),
          history.addMessage(new AIMessage(message.answer)),
        ]);
      }

      return await history.getMessages();
    } catch {
      throw new InternalServerErrorException(
        'Failed to create chat history',
      );
    }
  }

  /**
   * 指定されたパスからデータベースをロード
   * @param v_path - ベクトルのパス
   * @returns - データベースのインスタンス
   */
  private async loadDB(
    v_path: string,
  ): Promise<FaissStore> {
    const embeddingsModel = new OpenAIEmbeddings({
      openAIApiKey: this.langchainConfig.openAIApiKey,
    });
    return FaissStore.load(v_path, embeddingsModel);
  }

  /**
   * プロンプトを実行
   * @param db - データベース
   * @param message - メッセージ
   * @param chatHistory - チャットの履歴
   * @returns - チェーンの結果
   */
  private async runPrompt(
    db: FaissStore,
    message: string,
    chatHistory: BaseMessage[],
  ): Promise<ChainResult> {
    try {
      const retriever = db.asRetriever({
        searchType: 'similarity',
        k: 3,
      });
      const prompt = this.getPrompt();
      const chain = await this.createChain(
        retriever,
        prompt,
      );
      return this.runChain(chain, message, chatHistory);
    } catch {
      throw new InternalServerErrorException(
        'Failed to run prompt',
      );
    }
  }

  /**
   * プロンプトを取得
   * @returns - ChatPromptTemplate
   */
  private getPrompt(): ChatPromptTemplate {
    const SYSTEM_TEMPLATE = `**Previous Conversation:**
{chatHistory}

**Context:**
{context}

your a assistant that helps you with questions about the material.
Use the information above to answer the user's question.Please keep your answer at an appropriate length.
If you don't know the answer, just say '${this.NO_IDEA}'
`;

    const messages = [
      SystemMessagePromptTemplate.fromTemplate(
        SYSTEM_TEMPLATE,
      ),
      HumanMessagePromptTemplate.fromTemplate('{question}'),
    ];

    return ChatPromptTemplate.fromMessages(messages);
  }

  /**
   * チェーンを作成
   * @param retriever - VectorStoreRetriever
   * @param prompt - ChatPromptTemplate
   * @returns - RunnableSequence
   */
  private async createChain(
    retriever: VectorStoreRetriever<FaissStore>,
    prompt: ChatPromptTemplate,
  ): Promise<RunnableSequence> {
    const llm = new ChatOpenAI({
      modelName: 'gpt-3.5-turbo',
      temperature: 0.1,
      openAIApiKey: this.langchainConfig.openAIApiKey,
      callbacks: [
        {
          handleLLMEnd: async (output) => {
            this.usage =
              output.llmOutput.tokenUsage.totalTokens;
          },
        },
      ],
    });

    return RunnableSequence.from([
      {
        sourceDocuments: RunnableSequence.from([
          (input) => input.question,
          retriever,
        ]),
        question: (input) => input.question,
        chatHistory: (input) => input.chatHistory,
      },
      {
        referInfo: (previousStepResult) =>
          previousStepResult.sourceDocuments.map(
            (doc: any) => {
              return {
                page: doc.metadata.loc.pageNumber,
                content: doc.pageContent,
              };
            },
          ),
        question: (previousStepResult) =>
          previousStepResult.question,
        chatHistory: (previousStepResult) =>
          previousStepResult.chatHistory,
        context: (previousStepResult) => {
          const formattedDocuments =
            formatDocumentsAsString(
              previousStepResult.sourceDocuments,
            );
          const chatHistoryText =
            previousStepResult.chatHistory
              .map((message: BaseMessage) => {
                return message.content;
              })
              .join('\n');
          return `${formattedDocuments}\n${chatHistoryText}`;
        },
      },
      {
        answer: prompt
          .pipe(llm)
          .pipe(new StringOutputParser()),
        referInfo: (previousStepResult) =>
          previousStepResult.referInfo,
      },
    ]);
  }

  /**
   * チェーンを実行
   * @param chain - RunnableSequence
   * @param question - ユーザーの質問
   * @param chatHistory - チャットの履歴
   * @returns - チェーンの結果
   */
  private async runChain(
    chain: RunnableSequence,
    question: string,
    chatHistory: BaseMessage[],
  ): Promise<ChainResult> {
    const result: ChainResult = await chain.invoke({
      question,
      chatHistory,
    });

    result.usage = this.usage;

    if (result.answer === this.NO_IDEA) {
      result.referInfo = [];
      result.answer = this.NO_IDEA_MESSAGE;
    } else {
      const referedPages = [];
      result.answer = `${
        result.answer
      }\n\n 참조 : ${result.referInfo
        .reverse()
        .map((r) => {
          if (!referedPages.includes(r.page)) {
            referedPages.push(r.page);
            return `p.${r.page}`;
          }
        })
        .filter((page) => page)
        .join(', ')}`;
    }
    return result;
  }
}
