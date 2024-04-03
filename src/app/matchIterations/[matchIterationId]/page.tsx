import ContestantDetails from '@/app/components/ContestantDetails';
import Conversation from '@/app/components/Conversation';
import { PrismaClient } from '@prisma/client';

export default async function MatchIterationPage({
  params: { matchIterationId },
}: {
  params: { matchIterationId: string };
}) {
  const prisma = new PrismaClient();

  const matchIteration = await prisma.matchIteration.findUniqueOrThrow({
    where: { id: matchIterationId as string },
    include: { match: true },
  });

  const contestants = await prisma.contestant.findMany({
    where: { matchId: matchIteration.match.id },
    include: {
      ai: true,
      project: true,
      contextProvider: true,
    },
  });

  return (
    <main className="flex flex-col items-center mt-4">
      <div className="py-4">
        <h1>
          Details for Match Iteration <code>{matchIteration.id}</code>
        </h1>
        <div className="py-2">
          <p>
            Created on: <strong>{matchIteration.createdAt.toLocaleDateString()}</strong>
          </p>
          <p>
            Question: <strong>{matchIteration.question}</strong>
          </p>
        </div>
      </div>
      <div>
        <div className="grid grid-cols-2 gap-4">
          {contestants.map((contestant, index) => (
            <div key={contestant.id}>
              <ContestantDetails
                contestant={{
                  index,
                  aiName: contestant.ai.modelName,
                  projectName: contestant.project.name,
                  contextProviderName: contestant.contextProvider.name,
                }}
              />
              <Conversation matchIterationId={matchIteration.id} contestantId={contestant.id} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
