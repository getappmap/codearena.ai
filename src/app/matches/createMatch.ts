'use server';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';

const contestant = z.object({
  ai: z.string(),
  project: z.string(),
  contextProvider: z.string(),
});

export default async function createMatch(formData: FormData) {
  const contestantDataA = contestant.safeParse({
    ai: formData.get('ai[0]'),
    project: formData.get('project[0]'),
    contextProvider: formData.get('contextProvider[0]'),
  });
  const contestantDataB = contestant.safeParse({
    ai: formData.get('ai[1]'),
    project: formData.get('project[1]'),
    contextProvider: formData.get('contextProvider[1]'),
  });

  const question = formData.get('question') as string;

  const reportError = (errors: any) => {
    return {
      success: false,
      error: errors,
    };
  };

  if (!contestantDataA.success) return reportError(contestantDataA.error.flatten().fieldErrors);
  if (!contestantDataB.success) return reportError(contestantDataB.error.flatten().fieldErrors);

  const prisma = new PrismaClient();

  const buildContestant = async (data: typeof contestantDataA.data) => {
    const ai = await prisma.ai.findUniqueOrThrow({ where: { id: data.ai } });
    const project = await prisma.project.findUniqueOrThrow({ where: { id: data.project } });
    const contextProvider = await prisma.contextProvider.findUniqueOrThrow({
      where: { id: data.contextProvider },
    });
    return prisma.contestant.create({
      data: {
        ai: { connect: { id: ai.id } },
        project: { connect: { id: project.id } },
        contextProvider: { connect: { id: contextProvider.id } },
      },
    });
  };

  const [contestantA, contestantB] = await Promise.all([
    buildContestant(contestantDataA.data),
    buildContestant(contestantDataB.data),
  ]);

  const match = await prisma.match.create({
    data: { contestants: { connect: [{ id: contestantA.id }, { id: contestantB.id }] } },
  });

  const matchIteration = await prisma.matchIteration.create({
    data: {
      matchId: match.id as string,
      question: question as string,
    },
  });

  redirect(`/matchIterations/${matchIteration.id}`);
}
