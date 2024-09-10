import ProjectsList from '@/components/ProjectsList';
import ExtraTools from './ExtraTools';
import GitCloneSection from './GitCloneSection';
import ProjectTemplates from './ProjectTemplates';

export default function Launcher() {
  return (
    <div className='text-white max-w-screen-md animate-fade-in'>
      {/* <h1 className='text-3xl font-bold text-center text-blue-400 my-4'>Code Launcher</h1> */}
      <h1 className='text-md font-bold text-center text-blue-400 mb-1 mt-8 font-mono'>\ code launcher \</h1>
      <GitCloneSection />
      <ProjectTemplates />
      <ProjectsList />
      <ExtraTools />
    </div>
  );
}
