'use client';

import { useState, useEffect } from 'react';
import templates from '@/lib/templates';
import ProjectsList from './ProjectsList';

export default function DevLaunch() {
  const [result, setResult] = useState<any>(null);
  const [projects, setProjects] = useState<string[]>([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const response = await fetch('/api/ls');
    const data = await response.json();
    setProjects(data.projects);
  };

  const runCommand = async (command: string) => {
    const response = await fetch('/api/run-command', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ command }),
    });
    const data = await response.json();
    setResult(data);
  };

  const createProjectFolder = (template: any) => {
    const folderName = prompt(`Enter the project folder name for ${template.name}:`);
    if (folderName) {
      const command = template.command.replace(/\{folderName\}/g, folderName);
      runCommand(command);
    }
  };

  const runCustomCommand = () => {
    const command = prompt('Enter the command to run:');
    if (command) {
      runCommand(command);
    }
  };

  const openProjectInVSCode = (project: string) => {
    runCommand(`code ~/workspace/${project}`);
  };

  return (
    <div className='text-white'>
      <h1 className='text-3xl font-bold text-center text-blue-400 mb-8'>
        DevLaunch: Project Starter
      </h1>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8'>
        {templates.map((template, index) => (
          <button
            key={index}
            className='flex flex-col items-center p-4 bg-gray-800 border border-gray-700 rounded-lg transition duration-200 hover:bg-gray-700 hover:border-blue-500'
            onClick={() => createProjectFolder(template)}
          >
            <img
              src={template.icon}
              alt={`${template.name} icon`}
              className='w-12 h-12 mb-2 invert'
            />
            <span>{template.name}</span>
          </button>
        ))}
      </div>

      <ProjectsList projects={projects} onProjectClick={openProjectInVSCode} />

      {result && (
        <div className='bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <h2 className='text-xl font-semibold text-blue-400 border-b border-gray-700 pb-2 mb-2'>
                Command Output
              </h2>
              <pre className='bg-gray-900 p-2 rounded-md overflow-x-auto'>
                {result.commandOutput}
              </pre>
            </div>
            <div>
              <h2 className='text-xl font-semibold text-blue-400 border-b border-gray-700 pb-2 mb-2'>
                System Stats
              </h2>
              <p>CPU Usage: {result.cpuUsage}%</p>
              <p>Memory Usage: {result.memUsage}%</p>
            </div>
          </div>
        </div>
      )}

      <div className='flex justify-center space-x-4'>
        <button
          className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200'
          onClick={() => runCommand('ls -la ~')}
        >
          Run ls -la ~
        </button>
        <button
          className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200'
          onClick={runCustomCommand}
        >
          Run Custom Command
        </button>
      </div>
    </div>
  );
}
