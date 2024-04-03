'use client';

export type ContestantDetailsProps = {
  index: number;
  aiName: string;
  projectName: string;
  contextProviderName: string;
};

export default function ContestantDetails({ contestant }: { contestant: ContestantDetailsProps }) {
  return (
    <main>
      <h3 className="font-bold text-xl">Contestant {contestant.index + 1}</h3>
      <dl>
        <dt>
          <strong>AI</strong>
        </dt>
        <dd>{contestant.aiName}</dd>
        <dt>
          <strong>Project</strong>
        </dt>
        <dd>{contestant.projectName}</dd>
        <dt>
          <strong>Context Provider</strong>
        </dt>
        <dd>{contestant.contextProviderName}</dd>
      </dl>
    </main>
  );
}
