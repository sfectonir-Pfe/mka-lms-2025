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
async updateByContenuId(contenuId: number, data: { timeLimit: number; questions: any[] }) {
  const existingQuiz = await this.prisma.quiz.findUnique({
    where: { contenuId },
    include: {
      questions: {
        include: { choices: true },
      },
    },
  });

  if (!existingQuiz) {
    throw new Error("Quiz introuvable pour ce contenu.");
  }

  const questionIds = existingQuiz.questions.map((q) => q.id);

  // 🧹 Step 1: Delete old answers, choices, questions
  await this.prisma.answer.deleteMany({
    where: { questionId: { in: questionIds } },
  });

  await this.prisma.choice.deleteMany({
    where: { questionId: { in: questionIds } },
  });

  await this.prisma.question.deleteMany({
    where: { quizId: existingQuiz.id },
  });

  // 🧱 Step 2: Recreate questions (and choices)
  for (const question of data.questions) {
    const createdQuestion = await this.prisma.question.create({
      data: {
        text: question.text,
        type: question.type,
        score: question.score,
        negativeMark: question.negativeMark || 0,
        correctText: question.correctText || null,
        imageUrl: question.imageUrl || null,
        quizId: existingQuiz.id,
      },
    });

    if (['MCQ', 'IMAGE_CHOICE', 'TRUE_FALSE'].includes(question.type)) {
      for (const choice of question.choices || []) {
        await this.prisma.choice.create({
          data: {
            text: choice.text || null,
            imageUrl: choice.imageUrl || null,
            isCorrect: !!choice.isCorrect,
            questionId: createdQuestion.id,
          },
        });
      }
    }
  }

  // 🛠 Step 3: Update quiz fields (e.g., timeLimit)
  return this.prisma.quiz.update({
    where: { id: existingQuiz.id },
    data: {
      timeLimit: data.timeLimit,
    },
    include: {
      questions: {
        include: { choices: true },
      },
    },
  });
}



}

  