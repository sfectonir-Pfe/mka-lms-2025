import { Injectable } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { PrismaService } from 'nestjs-prisma';
@Injectable()
export class QuizService {
  constructor(private prisma: PrismaService) {}

  async create(createQuizDto: CreateQuizDto) {
  const { contenuId, title, description, timeLimit, questions } = createQuizDto;

  const quiz = await this.prisma.quiz.create({
    data: {
      contenu: { connect: { id: contenuId } },
      title,
      description,
      timeLimit,
    },
  });

  for (const question of questions) {
    const createdQuestion = await this.prisma.question.create({
      data: {
        text: question.text,
        imageUrl: question.imageUrl,
        type: question.type,
        score: question.score,
        negativeMark: question.negativeMark || 0,
        correctText: question.correctText,
        quizId: quiz.id,
      },
    });

    // Only add choices for types that need them
    if (['MCQ', 'IMAGE_CHOICE', 'TRUE_FALSE'].includes(question.type)) {
      for (const choice of question.choices || []) {
        await this.prisma.choice.create({
          data: {
            text: choice.text,
            imageUrl: choice.imageUrl,
            isCorrect: !!choice.isCorrect,
            questionId: createdQuestion.id,
          },
        });
      }
    }
  }

  return { message: 'Quiz created with advanced types ✅', quizId: quiz.id };
}

  async findAll() {
    return this.prisma.quiz.findMany({
      include: {
        contenu: true,
        questions: {
          include: {
            choices: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.quiz.findUnique({
      where: { id },
      include: {
        contenu: true,
        questions: {
          include: {
            choices: true,
          },
        },
      },
    });
  }
 async getQuizWithQuestions(contenuId: number) {
  const quiz = await this.prisma.quiz.findUnique({
    where: { contenuId },
    include: {
      questions: {
        include: {
          choices: true,
        },
      },
    },
  });

  if (!quiz) {
    throw new Error("Quiz not found for this contenu.");
  }

  return quiz; // ✅ Return the entire quiz, including timeLimit
}


}

  