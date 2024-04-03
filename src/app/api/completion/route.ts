import { NextRequest } from 'next/server';
import { useSearchParams } from 'next/navigation';
import { PrismaClient } from '@prisma/client';

import Completer from '../../../lib/Completer';
import { Context } from '@/lib/Context';
import ContextFetcher from '@/lib/ContextFetcher';

export async function GET(req: NextRequest) {
  // const searchParams = useSearchParams();
  // const params = new URLSearchParams(searchParams);
  // const contestantId = params.get('contestantId') as string;
  // const matchIterationId = params.get('matchIterationId') as string;

  const contestantId = req.nextUrl.searchParams.get('contestantId') as string;
  const matchIterationId = req.nextUrl.searchParams.get('matchIterationId') as string;

  const prisma = new PrismaClient();
  const contestant = await prisma.contestant.findUniqueOrThrow({
    where: { id: contestantId },
    include: { ai: true, project: true, contextProvider: true },
  });
  const matchIteration = await prisma.matchIteration.findUniqueOrThrow({
    where: { id: matchIterationId },
  });

  const contextFetcher = new ContextFetcher(
    ContextFetcher.buildUrl(contestant.project.url, contestant.contextProvider.name)
  );
  const tokenLimit = contestant.tokenLimit || 8000;
  const context = await contextFetcher.fetchContext(
    ContextFetcher.buildKeywords(matchIteration.question),
    ContextFetcher.computeCharLimit(tokenLimit)
  );
  let responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();

  const completer = new Completer(contestant.ai.modelName, 0.5 /* TODO contestant.temperature */);
  try {
    if (!context) throw new Error(`No context found for ${contestant.contextProvider.name}`);

    for await (const token of completer.complete(matchIteration.question, context)) {
      writer.write(encoder.encode('data: ' + token + '\n\n'));
    }
  } catch (e) {
    console.warn(`Error completing question`);
    console.warn(e);
    writer.write(encoder.encode(`data: Error ${e}\n\n`));
  } finally {
    writer.close();
  }

  return new Response(responseStream.readable, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'text/event-stream; charset=utf-8',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache, no-transform',
      'X-Accel-Buffering': 'no',
      'Content-Encoding': 'none',
    },
  });
}
