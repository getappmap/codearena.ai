import Conditional from '@/app/components/Conditional';
import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';

async function replay(formData: FormData) {
  'use server';
  const matchId = formData.get('matchId');
  if (!matchId) {
    throw new Error('No match ID provided');
  }

  const prisma = new PrismaClient();
  const completedIteration = await prisma.matchIteration.findUniqueOrThrow({
    where: { id: matchId.toString() },
    include: { match: true },
  });

  const newMatchIteration = await prisma.matchIteration.create({
    data: {
      matchId: completedIteration.match.id,
      question: completedIteration.question,
    },
  });

  redirect(`/matchIterations/${newMatchIteration.id}`);
}

export default async function Matches({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const pageNumber = searchParams.page ? parseInt(searchParams.page as string) : 1;
  const itemsPerPage = 10;

  const prisma = new PrismaClient();
  const matchCount = await prisma.matchIteration.count();
  const matches = await prisma.matchIteration.findMany({
    skip: (pageNumber - 1) * itemsPerPage,
    orderBy: { createdAt: 'desc' },
    take: itemsPerPage,
    include: {
      match: {
        include: {
          contestants: {
            include: {
              ai: true,
              project: true,
              contextProvider: true,
            },
          },
        },
      },
    },
  });
  const hasNextPage = matchCount > pageNumber * itemsPerPage;
  const hasPreviousPage = pageNumber > 1;

  return (
    <main className="flex flex-col items-center mt-4">
      <h2>Completed matches</h2>
      <div className="mt-4">
        <ul>
          {matches.map((match) => (
            <li key={match.id}>
              <strong>Match ID: {match.id}</strong>
              <form action={replay}>
                <input type="hidden" name="matchId" value={match.id} />
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
                  Replay
                </button>
              </form>
              <dl>
                <dt>Created At</dt>
                <dd>{match.createdAt.toLocaleDateString()}</dd>
                <dt>Question</dt>
                <dd>{match.question}</dd>
                <dt>Contestants</dt>
                <dd>
                  <ul>
                    {match.match.contestants.map((contestant, index) => (
                      <li key={contestant.id}>
                        {contestant.ai.modelName}
                        <dl>
                          <dt>Project</dt>
                          <dd>{contestant.project.name}</dd>
                          <dt>Context Provider</dt>
                          <dd>{contestant.contextProvider.name}</dd>
                        </dl>
                      </li>
                    ))}
                  </ul>
                </dd>
              </dl>
            </li>
          ))}
        </ul>
      </div>
      <Conditional condition={hasPreviousPage}>
        <form action="/matches" method="get" className="mt-4">
          <input type="hidden" name="page" value={pageNumber - 1} />
          <button type="submit">Previous page</button>
        </form>
      </Conditional>
      <Conditional condition={hasNextPage}>
        <form action="/matches" method="get" className="mt-4">
          <input type="hidden" name="page" value={pageNumber + 1} />
          <button type="submit">Next page</button>
        </form>
      </Conditional>
    </main>
  );
}
