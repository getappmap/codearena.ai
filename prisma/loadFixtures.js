const { join } = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const fileContents = fs.readFileSync(join(__dirname, 'fixtures.yml'), 'utf8');
  const data = yaml.load(fileContents);

  for (const item of data.Ai) {
    await prisma.ai.create({ data: item });
  }

  for (const item of data.ContextProvider) {
    await prisma.contextProvider.create({ data: item });
  }

  for ( const item of data.Project) {
    await prisma.project.create({ data: item });
  }

  for ( const item of data.ProjectContextProvider) {
    const project = await prisma.project.findUnique({ where: {name: item.project}});
    const contextProvider = await prisma.contextProvider.findUnique({ where: {name: item.contextProvider}});
    await prisma.projectContextProvider.create({ data: { projectId: project.id, contextProviderId: contextProvider.id } });
  }

  console.log('Fixtures loaded successfully!');
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

  