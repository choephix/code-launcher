import ProjectsList from '@/components/ProjectsList';
import Footer from './Footer';
import ProjectTemplates from './ProjectTemplates';
import SmartBar from './SmartBar';

import { actions, store, useStore } from '@/lib/store';
import { useEffect } from 'react';

export default function Launcher() {
  const { pathToWorkspaces } = useStore();

  useEffect(() => {
    actions.refreshProjects().then(() => {
      store.uiState.showTemplates = store.projects !== null && store.projects.length < 10;
    });
  }, []);

  // const title = '{code:launcher}';
  // const title = 'code:launcher';
  const title = pathToWorkspaces || 'code:launcher';

  return (
    <div className="flex flex-col min-h-screen text-white w-full max-w-screen-md mx-auto animate-fade-in">
      <div className="flex-grow p-5">
        <h1 className="text-md font-bold text-center text-blue-400 mb-4 mt-8 font-mono">{title}</h1>

        <div className="mb-10">
          <SmartBar />
        </div>

        <div className="mb-10">
          <ProjectTemplates />
        </div>

        <div className="mb-10">
          <ProjectsList />
        </div>
      </div>

      <Footer />
    </div>
  );
}
