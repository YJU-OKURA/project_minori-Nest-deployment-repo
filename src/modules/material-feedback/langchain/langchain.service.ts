import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { Document } from '@langchain/core/documents';
import {
  ChatPromptTemplate,
  FewShotChatMessagePromptTemplate,
  PromptTemplate,
} from '@langchain/core/prompts';
import {
  FeedbackExamples,
  pageFeedbackExamples,
} from './feedback.example';
import { LangchainConfig } from '@common/configs/config.interface';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from '@langchain/openai';
import { ChatAnthropic } from '@langchain/anthropic';
import { Response } from 'express';

@Injectable()
export class LangchainService {
  private readonly langchainConfig: LangchainConfig;
  private usage: number;
  private feedback: string = '';

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.langchainConfig =
      this.configService.get<LangchainConfig>('langchain');
  }

  /**
   * 質問に対する回答を取得
   * @param blob - 文書のBlobデータ
   * @returns 分割された文書のフォーマット済みテキスト
   */
  async getDocument(blob: Blob) {
    const docs = await this.splitDocument(blob);
    return this.formatDocument(docs);
  }

  /**
   * ページに関するフィードバックを取得
   * @param pageContent - ページの内容
   * @param referedContents - 参照された内容
   * @param response - レスポンスオブジェクト
   * @returns フィードバックをストリーミング
   */
  async pageFeedback(
    mostReferedPage: number,
    pageContent: string,
    referedContents: string,
    response: Response,
  ) {
    const content = `${FeedbackExamples.MATERIAL}: ${mostReferedPage}의 내용 - ${pageContent}\n ${FeedbackExamples.PART_RELEVANT_TO_THE_QUESTIONS}: ${referedContents}`;
    const prompt = await this.getFeedbackPrompt(
      'page',
      content,
    );

    return this.runFeedbackPrompt(prompt, response, 'page');
  }

  /**
   * 全体の資料に関するフィードバックを取得
   * @param content - フィードバックする内容
   * @param response - レスポンスオブジェクト
   * @returns フィードバックをストリーミング
   */
  async materialFeedback(
    content: string,
    response: Response,
  ) {
    const prompt = await this.getFeedbackPrompt(
      'all',
      content,
    );
    return this.runFeedbackPrompt(prompt, response, 'all');
  }

  /**
   * 文書を分割する
   * @param blob - 文書のBlobデータ
   * @returns 分割された文書
   */
  private async splitDocument(
    blob: Blob,
  ): Promise<Document[]> {
    const loader = new PDFLoader(blob);
    const pages = await loader.loadAndSplit();
    return pages;
  }

  /**
   * 文書をフォーマットする
   * @param docs - 分割された文書
   * @returns フォーマット済みの文書
   */
  private formatDocument(docs: Document[]): string[] {
    let pageNumber = 1;
    let content = '';
    const formattedDocs = docs.reduce((acc, doc) => {
      const currentPageNumber = doc.metadata.loc.pageNumber;
      if (pageNumber < currentPageNumber) {
        if (content) {
          acc.push(content);
          content = '';
        }
        pageNumber = currentPageNumber;
      }
      content += doc.pageContent;
      return acc;
    }, []);

    if (content) {
      formattedDocs.push(content);
    }

    return formattedDocs;
  }

  /**
   * プロンプトを取得する
   * @param type - プロンプトのタイプ ('page' or 'all')
   * @param content - フィードバックする内容
   * @returns フォーマット済みプロンプト
   */
  private async getFeedbackPrompt(
    type: 'page' | 'all',
    content: string,
  ) {
    if (type === 'page') {
      const examplePrompt =
        ChatPromptTemplate.fromTemplate(`Human: {input}
    AI: {output}`);

      const fewShotPrompt =
        new FewShotChatMessagePromptTemplate({
          examplePrompt,
          examples: pageFeedbackExamples,
          suffix: 'Human: {input}',
          inputVariables: ['input'],
        });

      const formattedPrompt = await fewShotPrompt.format({
        input: content,
      });

      return formattedPrompt;
    } else {
      const prompt = PromptTemplate.fromTemplate(
        `You're an assistant giving feedback on a specific document. In the document below, you'll need to tell us in detail which pages and which parts of the document need to be fixed, whether it's the overall flow or the content.
        Only tell us about the pages that need fixing.
      {material}`,
      );

      const formattedPrompt = await prompt.format({
        material: content,
      });

      return formattedPrompt;
    }
  }

  /**
   * 資料に対するフィードバックをストリーミング
   * @param prompt - プロンプト
   * @param response - フィードバック
   * @param type - 処理タイプ ('page' | 'all')
   * @returns - なし
   */
  private async runFeedbackPrompt(
    prompt: string,
    response: Response,
    type: 'page' | 'all',
  ) {
    try {
      response.writeHead(200, {
        'Content-Type': 'text/plain',
        'Transfer-Encoding': 'chunked',
      });

      const callbacks = [
        {
          handleLLMNewToken: async (token) => {
            this.feedback += token;
            response.write(token);
          },
          handleLLMEnd: async (output) => {
            this.usage =
              output.llmOutput.estimatedTokenUsage.totalTokens;
          },
        },
      ];

      const model =
        type === 'page'
          ? new ChatOpenAI({
              modelName: 'gpt-3.5-turbo',
              temperature: 0.5,
              streaming: true,
              openAIApiKey:
                this.langchainConfig.openAIApiKey,
              callbacks,
            })
          : new ChatAnthropic({
              temperature: 0.1,
              modelName: 'claude-3-sonnet-20240229',
              streaming: true,
              anthropicApiKey:
                this.langchainConfig.anthropicApiKey,
              callbacks,
            });

      return model.invoke(prompt);
    } catch {
      throw new InternalServerErrorException(
        'Failed to get feedback.',
      );
    }
  }

  /**
   * 指定された参照からキーワードを取得します。
   * @param refers - ドキュメントの内容を参照
   * @returns - キーワード
   */
  async getKeyword(refers: string) {
    try {
      const prompt = await this.getKeywordPrompt(refers);
      const keywords = await this.runKeywordPrompt(prompt);
      return JSON.parse(keywords.content as string);
    } catch {
      throw new InternalServerErrorException(
        'Failed to get keywords.',
      );
    }
  }

  /**
   * キーワードプロンプトを生成
   * @param content - ドキュメントの内容
   * @returns - プロンプト
   */
  private async getKeywordPrompt(content: string) {
    const prompt = PromptTemplate.fromTemplate(
      `You are an assistant that returns keywords from the content of a given document in the form of JSON like this, 3 per page, for the most questionable parts of the document.
      **reference**
      {reference}
      **json example**
      "{{
      page: 1
      keywords: ['phone', 'number']
      }}". Return JSON only.`,
    );

    const formattedPrompt = await prompt.format({
      reference: content,
    });

    return formattedPrompt;
  }

  /**
   * キーワードプロンプトを実行し、キーワードを取得
   * @param prompt - プロンプト
   * @returns - 実行結果
   */
  private async runKeywordPrompt(prompt: string) {
    const model = new ChatOpenAI({
      modelName: 'gpt-3.5-turbo',
      temperature: 0.1,
      streaming: true,
      openAIApiKey: this.langchainConfig.openAIApiKey,
    });

    return model.invoke(prompt);
  }
}
