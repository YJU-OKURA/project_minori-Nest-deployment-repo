import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { Document } from '@langchain/core/documents';
import { PromptTemplate } from '@langchain/core/prompts';
import { LangchainConfig } from '@common/configs/config.interface';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from '@langchain/openai';

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
   * クイズを取得
   * @param content - ドキュメントの内容
   * @returns - クイズ
   */
  async getQuiz(content: string) {
    try {
      const prompt = await this.getPrompt(content);
      const response = await this.runPrompt(prompt);
      const quiz = JSON.parse(response.lc_kwargs.content);
      return quiz;
    } catch {
      throw new InternalServerErrorException(
        'Failed to get quiz by using LLM',
      );
    }
  }

  /**
   * キーワードプロンプトを生成
   * @param content - ドキュメントの内容
   * @returns - プロンプト
   */
  private async getPrompt(content: string) {
    const prompt = PromptTemplate.fromTemplate(
      `
      You are an assistant who returns a quiz based on the contents of the given document in the JSON format below. There is only one answer to the quiz.
      **content**
      {content}

      **json example**
      "{{
        question: '관계 데이터베이스 관리 시스템(RDBMS)과 NoSQL에 대한 설명으로 옳은 것은?',
        answer: {{
          a: 'RDBMS는 NoSQL보다 약한 스키마를 요구한다.',
          b: 'NoSQL은 RDBMS보다 엄격한 일관성 모델을 보장한다.',
          c: 'NoSQL은 RDBMS보다 정형 데이터를 저장하기에 적합하다.',
          d: 'NoSQL 데이터 모델로 키－값(key-value), 문서 기반(document-based), 그래프 기반(graph-based) 모델이 있다.',
        }},
        commentary: {{
          correctAnswer: 'd',
          content: 'RDBMS는 NoSQL보다 구체적이고 엄격한 스키마를 요구하며, NoSQL보다 엄격하게 일관성을 보장한다. 또 RDBMS가 정형 데이터를 저장하기에 적합하다. D는 올바른 설명이다.',
        }},
      }}". 

      **caution**
      Return JSON only.`,
    );

    const formattedPrompt = await prompt.format({
      content,
    });

    return formattedPrompt;
  }

  /**
   * キーワードプロンプトを実行し、キーワードを取得
   * @param prompt - プロンプト
   * @returns - 実行結果
   */
  private async runPrompt(prompt: string) {
    const model = new ChatOpenAI({
      modelName: 'gpt-3.5-turbo',
      temperature: 0.8,
      openAIApiKey: this.langchainConfig.openAIApiKey,
    });

    return model.invoke(prompt);
  }

  /**
   * ドキュメントを分割
   * @param blob - ドキュメント
   * @returns - 分割されたドキュメント
   */
  async getDocument(blob: Blob) {
    const docs = await this.splitDocument(blob);
    return this.formatDocument(docs);
  }

  /**
   * ドキュメントを分割
   * @param blob - ドキュメント
   * @returns - 分割されたドキュメント
   */
  private async splitDocument(
    blob: Blob,
  ): Promise<Document[]> {
    const loader = new PDFLoader(blob);
    const pages = await loader.loadAndSplit();
    return pages;
  }

  /**
   * ドキュメントを整形
   * @param docs - ドキュメント
   * @returns - 整形されたドキュメント
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
}
