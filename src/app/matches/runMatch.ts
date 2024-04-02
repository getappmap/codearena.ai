import { MatchIteration, PrismaClient } from "@prisma/client";
import assert, { match } from "assert";
import { error } from "console";

export default async function runMatch(matchIteration: MatchIteration) {
  console.warn(matchIteration.question);

  const prisma = new PrismaClient();
  const match = await prisma.match.findUniqueOrThrow({
    where: { id: matchIteration.matchId },
    include: {
      contestants: {
        include: {
          project: true,
          contextProvider: true,
        },
      },
    },
  });

  const keywords = matchIteration.question.split(' ');

  for ( const contestant of match.contestants ) {
    console.warn(`Contestant ${contestant.id} is a part of the match.`);
    const { url: baseUrl } = contestant.project;
    const { name: provider } = contestant.contextProvider;

    const url = `${baseUrl}/context/${provider}`;
    console.warn(`Requesting context from ${url}`);

    const tokenLimit = contestant.tokenLimit || 8000;
    const charLimit = tokenLimit * 3;
    const response = await fetch(url, {
      body: JSON.stringify({ charLimit, keywords }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.warn(`Response from ${url}: ${response.status}`);
    const { body } = response;
    if ( body === null ) {
      error(`No body in response from ${url}`);
      continue;
    }

    const reader = body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = new TextDecoder().decode(value);
      console.warn(`Chunk: ${chunk}`);
    }
  }

  return matchIteration;
}
