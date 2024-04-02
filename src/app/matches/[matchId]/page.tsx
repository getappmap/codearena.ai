import { PrismaClient } from '@prisma/client'
import React from 'react'
import runMatch from '../runMatch';

async function ask(formData: FormData) {
  'use server'

  const prisma = new PrismaClient()
  const matchId = formData.get('matchId')
  const question = formData.get('question')

  console.warn(question);

  const matchIteration = await prisma.matchIteration.create({
    data: {
      matchId: matchId as string,
      question: question as string,
    }
  })

  await runMatch(matchIteration);
}

export default async function MatchPage({
  params: { matchId },
}: {
  params: { matchId: string }
}) {
  const prisma = new PrismaClient()

  const match = await prisma.match.findUnique({
    where: { id: matchId as string },
  })

  if (!match) {
    return <div>Match not found</div>
  }

  const contestants = await prisma.contestant.findMany({
    where: { matchId: match.id },
    include: {
      ai: true,
      project: true,
      contextProvider: true,
    }
  })

  return (
    <main className="flex min-h-screen flex-col items-center mt-4">
      <div>
        <h1>Details for Match:</h1>
        <div className="mt-4">
          <p>
            Created on: <strong>{match.createdAt.toLocaleDateString()}</strong>
          </p>
        </div>
      </div>
      <div>
        <div className="grid grid-cols-2 gap-4">
          {contestants.map((contestant, index) => (
            <div key={contestant.id}>
              <h3>Contestant {index + 1}</h3>
              <dl>
                <dt><strong>AI</strong></dt>
                <dd>{contestant.ai.name}</dd>
                <dt><strong>Project</strong></dt>
                <dd>{contestant.project.name}</dd>
                <dt><strong>Context Provider</strong></dt>
                <dd>{contestant.contextProvider.name}</dd>
              </dl>
              <div className="mt-4">
                AI {index + 1 } response here...
              </div>
            </div>
          ))}
        </div>
        <form action={ask}>
          <input type="textarea" name="question" placeholder="Ask a question..."></input>
          <input type="hidden" name="matchId" value={matchId}></input>
          <button type="submit">Submit</button>
        </form>
      </div>
    </main>
  )
}
