import ProjectsList from '@/components/ProjectsList';
import Footer from './Footer';
import ProjectTemplates from './ProjectTemplates';
import SmartBar from './SmartBar';

export default function Launcher() {
  return (
    <div className='text-white w-full max-w-screen-md animate-fade-in'>
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

      <Footer />
    </div>
  );
}
