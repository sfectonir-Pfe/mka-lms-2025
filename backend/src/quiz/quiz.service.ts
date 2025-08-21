import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, QuestionType } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class QuizService {
  constructor(private prisma: PrismaService) {}

  // Create a quiz under a Contenu (type must be Quiz)
  async create(body: any) {
    const { contenuId, title, description, timeLimit, questions } = body;

    if (!contenuId) throw new BadRequestException('contenuId is required');
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new BadRequestException('questions array is required');
    }

    // Ensure contenu exists and is of type Quiz
    const contenu = await this.prisma.contenu.findUnique({
      where: { id: Number(contenuId) },
      select: { id: true, type: true, published: true },
    });
    if (!contenu) throw new NotFoundException('Contenu not found');
    if (contenu.type !== 'Quiz') throw new BadRequestException('Contenu.type must be Quiz');

    try {
      const result = await this.prisma.$transaction(async (tx) => {
        const quiz = await tx.quiz.create({
          data: { contenuId: Number(contenuId), title: title ?? null, description: description ?? null, timeLimit: timeLimit ?? null },
        });

        for (const q of questions) {
          const createdQ = await tx.question.create({
            data: {
              text: q.text,
              imageUrl: q.imageUrl ?? null,
              type: (q.type as QuestionType) ?? 'MCQ',
              score: q.score ?? 1,
              negativeMark: q.negativeMark ?? 0,
              correctText: q.correctText ?? null,
              quizId: quiz.id,
            },
          });

          const needsChoices = ['MCQ', 'IMAGE_CHOICE', 'TRUE_FALSE'].includes(q.type);
          let choices: any[] = [];

          if (needsChoices) {
            if (q.type === 'TRUE_FALSE' && (!q.choices || q.choices.length === 0)) {
              // auto choices for T/F; correctText can be 'true' or 'false' (optional)
              const isTrue = (q.correctText ?? 'true').toString().toLowerCase() === 'true';
              choices = [
                { text: 'True', imageUrl: null, isCorrect: isTrue },
                { text: 'False', imageUrl: null, isCorrect: !isTrue },
              ];
            } else {
              choices = (q.choices ?? []).map((c: any) => ({
                text: c.text ?? null,
                imageUrl: c.imageUrl ?? null,
                isCorrect: !!c.isCorrect,
              }));
            }
          }

          if (choices.length) {
            await tx.choice.createMany({
              data: choices.map((c: any) => ({
                text: c.text,
                imageUrl: c.imageUrl,
                isCorrect: c.isCorrect,
                questionId: createdQ.id,
              })),
            });
          }
        }

        return { message: 'Quiz created ✅', quizId: quiz.id };
      });

      return result;
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        // unique on contenuId
        throw new BadRequestException('A quiz already exists for this contenu');
      }
      throw e;
    }
  }

  async findAll() {
    return this.prisma.quiz.findMany({
      include: {
        contenu: true,
        questions: { include: { choices: true } },
      },
      orderBy: { id: 'desc' },
    });
  }

  async findOne(id: number) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: {
        contenu: true,
        questions: { include: { choices: true } },
      },
    });
    if (!quiz) throw new NotFoundException('Quiz not found');
    return quiz;
  }

  // Fetch quiz by contenuId (for builder or play intro)
  async getQuizWithQuestions(contenuId: number) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { contenuId },
      include: {
        contenu: { select: { id: true, title: true, type: true, published: true } },
        questions: { include: { choices: true } },
      },
    });

    if (!quiz) throw new NotFoundException('Quiz not found for this contenu');
    if (quiz.contenu.type !== 'Quiz') {
      throw new BadRequestException('Contenu is not of type Quiz');
    }
    return quiz;
  }

  // Full replace update by contenuId (atomic)
  async updateByContenuId(contenuId: number, data: any) {
    const { timeLimit, title, description, questions } = data;

    if (!Array.isArray(questions) || questions.length === 0) {
      throw new BadRequestException('questions array is required');
    }

    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.quiz.findUnique({
        where: { contenuId },
        include: { questions: { select: { id: true } } },
      });
      if (!existing) throw new NotFoundException('Quiz introuvable pour ce contenu');

      const qIds = existing.questions.map((q) => q.id);

      // wipe old details
      await tx.answer.deleteMany({ where: { questionId: { in: qIds } } });
      await tx.choice.deleteMany({ where: { questionId: { in: qIds } } });
      await tx.question.deleteMany({ where: { quizId: existing.id } });

      // recreate questions (+ choices)
      for (const q of questions) {
        const createdQ = await tx.question.create({
          data: {
            text: q.text,
            type: (q.type as QuestionType) ?? 'MCQ',
            score: q.score ?? 1,
            negativeMark: q.negativeMark ?? 0,
            correctText: q.correctText ?? null,
            imageUrl: q.imageUrl ?? null,
            quizId: existing.id,
          },
        });

        if (['MCQ', 'IMAGE_CHOICE', 'TRUE_FALSE'].includes(q.type)) {
          let choices: any[] = [];
          if (q.type === 'TRUE_FALSE' && (!q.choices || q.choices.length === 0)) {
            const isTrue = (q.correctText ?? 'true').toString().toLowerCase() === 'true';
            choices = [
              { text: 'True', imageUrl: null, isCorrect: isTrue },
              { text: 'False', imageUrl: null, isCorrect: !isTrue },
            ];
          } else {
            choices = (q.choices ?? []).map((c: any) => ({
              text: c.text ?? null,
              imageUrl: c.imageUrl ?? null,
              isCorrect: !!c.isCorrect,
            }));
          }

          if (choices.length) {
            await tx.choice.createMany({
              data: choices.map((c: any) => ({
                text: c.text,
                imageUrl: c.imageUrl,
                isCorrect: c.isCorrect,
                questionId: createdQ.id,
              })),
            });
          }
        }
      }

      return tx.quiz.update({
        where: { id: existing.id },
        data: {
          timeLimit: timeLimit ?? existing.timeLimit,
          title: title ?? existing.title,
          description: description ?? existing.description,
        },
        include: { questions: { include: { choices: true } } },
      });
    });
  }
}
