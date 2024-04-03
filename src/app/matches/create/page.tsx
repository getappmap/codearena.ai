'use server';
import { PrismaClient } from '@prisma/client';
import React from 'react';

import createMatch from '../createMatch';

export default async function CreateMatch() {
  const prisma = new PrismaClient();
  const ais = await prisma.ai.findMany();
  const projects = await prisma.project.findMany();
  // TODO: Select available context providers from the selected project.
  // Or update the project / context provider lists dynamically.
  const contextProviders = await prisma.contextProvider.findMany();

  return (
    <main className="flex flex-col items-center mt-4">
      <p className="max-w-3xl pt-2 pb-4">
        To create an Code Match, you start by configuring two contestants. You can select the AI
        model, a software project that the AI model will be asked about, and the context provider
        that will provide the AI with information about the project.
      </p>
      <p>
        You will also specify the question that both AIs will be asked about the project you've
        selected.
      </p>
      <form action={createMatch} className="flex flex-col items-center">
        {/*
        Divide the page into two columns, with the left column containing the form fields for the first contestant
        and the right column containing the form fields for the second contestant. Use a grid layout to achieve this.
        */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <h3 className="font-bold">First contestant</h3>
            <label>
              AI
              <select name="ai[0]" id="ai[0]">
                {ais.map((ai) => (
                  <option key={ai.id} value={ai.id}>
                    {ai.modelName}
                  </option>
                ))}
                {/* TODO: Token limit */}
              </select>
            </label>
            <label>
              Project
              <select name="project[0]" id="project[0]">
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Context Provider
              <select name="contextProvider[0]" id="contextProvider[0]">
                {contextProviders.map((contextProvider) => (
                  <option key={contextProvider.id} value={contextProvider.id}>
                    {contextProvider.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold">Second contestant</h3>
            <label>
              AI
              <select name="ai[1]" id="ai[1]">
                {ais.map((ai) => (
                  <option key={ai.id} value={ai.id}>
                    {ai.modelName}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Project
              <select name="project[1]" id="project[1]">
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Context Provider
              <select name="contextProvider[1]" id="contextProvider[1]">
                {contextProviders.map((contextProvider) => (
                  <option key={contextProvider.id} value={contextProvider.id}>
                    {contextProvider.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
        <div>
          <div className="mt-4">
            <textarea
              name="question"
              rows="4"
              cols="80"
              placeholder="Enter your question..."
            ></textarea>
          </div>
          <div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            >
              Create match
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
