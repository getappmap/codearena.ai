import { PrismaClient } from '@prisma/client';

export default async function Projects() {
  const prisma = new PrismaClient();
  const projects = await prisma.project.findMany();

  return (
    <main className="flex flex-col items-center mt-4">
      <h2>AI Dev Match - Project List</h2>
      <p className="mt-4">{projects.length} Projects are available:</p>
      <div className="mt-4">
        <ul>
          {projects.map((project) => (
            <li key={project.id}>
              <strong>{project.name}</strong>
              <dl>
                <dt>Description</dt>
                <dd>{project.description}</dd>
                <dt>URL</dt>
                <dd>
                  <a href={project.url} target="_blank" />
                </dd>
              </dl>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
