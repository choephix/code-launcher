'use client';

import ProjectsList from '@/components/ProjectsList';
import ExtraTools from './ExtraTools';
import ProjectTemplates from './ProjectTemplates';

export default function DevLaunch() {
  return (
    <div className='text-white'>
      <h1 className='text-3xl font-bold text-center text-blue-400 mb-8'>Code Launcher</h1>
      <ProjectTemplates />
      <ProjectsList />
      <ExtraTools />
    </div>
  );
}
