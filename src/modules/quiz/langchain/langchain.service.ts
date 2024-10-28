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
import { QuizContent } from '../dto/create-update.dto';
import { Answer } from '@prisma/client';

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
  async getQuizzes(
    content: string,
  ): Promise<QuizContent[]> {
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
      You are an assistant that returns 5 4-choice multiple-choice quizzes based on the content of the given document in the same language as the content, formatted in the strict JSON format below. There is only one correct answer to each quiz. Make sure to follow the specified JSON structure precisely.

      **content**
      {content}

      **json example**
      "{{
        quizzes: [
          {{
            question: '관계 데이터베이스 관리 시스템(RDBMS)과 NoSQL에 대한 설명으로 옳은 것은?',
            answer: {{
              ${Answer.a}: 'RDBMS는 NoSQL보다 약한 스키마를 요구한다.',
              ${Answer.b}: 'NoSQL은 RDBMS보다 엄격한 일관성 모델을 보장한다.',
              ${Answer.c}: 'NoSQL은 RDBMS보다 정형 데이터를 저장하기에 적합하다.',
              ${Answer.d}: 'NoSQL 데이터 모델로 키－값(key-value), 문서 기반(document-based), 그래프 기반(graph-based) 모델이 있다.',
            }},
            commentary: {{
              correctAnswer: '${Answer.d}',
              content: 'RDBMS는 NoSQL보다 구체적이고 엄격한 스키마를 요구하며, NoSQL보다 엄격하게 일관성을 보장한다. 또 RDBMS가 정형 데이터를 저장하기에 적합하다. D는 올바른 설명이다.',
            }},
          }},
          {{
            question: 'Python의 주요 특징 중 하나는 무엇인가요?',
            answer: {{
              ${Answer.a}: 'Python은 정적 타이핑을 지원한다.',
              ${Answer.b}: 'Python은 객체 지향 언어이다.',
              ${Answer.c}: 'Python은 컴파일 언어이다.',
              ${Answer.d}: 'Python은 다중 스레딩을 지원하지 않는다.',
            }},
            commentary: {{
              correctAnswer: '${Answer.b}',
              content: 'Python은 객체 지향 프로그래밍을 지원하는 동적 타이핑 언어입니다. B가 올바른 설명입니다.',
            }},
          }},
          {{
            question: '다음 중 프로그래밍 언어가 아닌 것은?',
            answer: {{
              ${Answer.a}: 'Java',
              ${Answer.b}: 'Python',
              ${Answer.c}: 'HTML',
              ${Answer.d}: 'C++',
            }},
            commentary: {{
              correctAnswer: '${Answer.c}',
              content: 'HTML은 마크업 언어로, 프로그래밍 언어가 아닙니다. C가 올바른 설명입니다.',
            }}
          }},
          {{
            question: 'CSS의 주요 목적은 무엇인가요?',
            answer: {{
              ${Answer.a}: '웹 페이지의 기능을 정의한다.',
              ${Answer.b}: '웹 페이지의 스타일을 정의한다.',
              ${Answer.c}: '서버와 클라이언트 간의 통신을 담당한다.',
              ${Answer.d}: '데이터베이스를 관리한다.',
            }},
            commentary: {{
              correctAnswer: '${Answer.b}',
              content: 'CSS는 웹 페이지의 스타일을 정의하는 언어입니다. B가 올바른 설명입니다.',
            }}
          }},
        ]
      }}". 

      **caution**
      Return JSON only. Ensure all quizzes are in the same language as the provided content and follow the exact format given.`,
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
      temperature: 0.85,
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
