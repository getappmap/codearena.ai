import { PrismaClient } from '@prisma/client';
import Link from 'next/link';

export default async function Ais() {
  const prisma = new PrismaClient();
  const ais = await prisma.ai.findMany();

  return (
    <main className="flex flex-col items-center mt-4">
      <h2>AI Dev Match - AI List</h2>
      <p className="mt-4">{ais.length} AIs are available:</p>
      <div className="mt-4">
        <ul>
          {ais.map((ai) => (
            <li key={ai.id}>
              <strong>{ai.modelName}</strong>
              <dl>
                <dt>Token Limit</dt>
                <dd>{ai.tokenLimit}</dd>
              </dl>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
