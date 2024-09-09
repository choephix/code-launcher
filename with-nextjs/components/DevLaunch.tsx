import ProjectsList from '@/components/ProjectsList';
import ExtraTools from './ExtraTools';
import GitCloneSection from './GitCloneSection';
import ProjectTemplates from './ProjectTemplates';

export default function DevLaunch() {
  return (
    <div className='text-white max-w-screen-md'>
      <h1 className='text-3xl font-bold text-center text-blue-400 mb-8'>Code Launcher</h1>
      <ProjectTemplates />
      <GitCloneSection />
      <ProjectsList />
      <ExtraTools />
    </div>
  );
}
