'use client';

export type ContestantDetailsProps = {
  aiName: string;
  projectName: string;
  contextProviderName: string;
};

export default function ContestantDetails({ contestant }: { contestant: ContestantDetailsProps }) {
  return (
    <main>
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
