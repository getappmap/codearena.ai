'use server'
import { PrismaClient } from '@prisma/client'
import React from 'react'

import createMatch from '../createMatch'

export default async function CreateMatch() {
  const prisma = new PrismaClient()
  const ais = await prisma.ai.findMany()
  const projects = await prisma.project.findMany()
  // TODO: Select available context providers from the selected project.
  // Or update the project / context provider lists dynamically.
  const contextProviders = await prisma.contextProvider.findMany()

  return (
    <main className="flex min-h-screen flex-col items-center mt-4">
      <form action={createMatch} className="flex flex-col items-center">
        <h2>
          Create a new match
        </h2>
        {
        /*
        Divide the page into two columns, with the left column containing the form fields for the first contestant
        and the right column containing the form fields for the second contestant. Use a grid layout to achieve this.
        */
        }
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3>
              First contestant
            </h3>
            <label>
              AI
              <select name="ai[0]" id="ai[0]">
                {ais.map((ai) => (
                  <option key={ai.id} value={ai.id}>
                    {ai.name}
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
          <div>
            <h3>
              Second contestant
            </h3>
            <label>
              AI
              <select name="ai[1]" id="ai[1]">
                {ais.map((ai) => (
                  <option key={ai.id} value={ai.id}>
                    {ai.name}
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
        <button type="submit" className="mt-4">
          Create match
        </button>
      </form>
    </main>
  )
}
