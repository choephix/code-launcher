import ProjectsList from '@/components/ProjectsList';
import ExtraTools from './ExtraTools';
import SmartBar from './SmartBar';
import ProjectTemplates from './ProjectTemplates';

export default function Launcher() {
  return (
    <div className='text-white max-w-screen-md animate-fade-in'>
      {/* <h1 className='text-3xl font-bold text-center text-blue-400 my-4'>Code Launcher</h1> */}
      <h1 className='text-md font-bold text-center text-blue-400 mb-3 mt-8 font-mono'>
        {'{code:launcher}'}
      </h1>

      <div className='mb-10'>
        <SmartBar />
      </div>

      <div className='mb-10'>
        <ProjectTemplates />
      </div>

      <div className='mb-10'>
        <ProjectsList />
      </div>

      <ExtraTools />
    </div>
  );
}
