import { useEffect } from 'react';

import Footer from '@/components/Footer';
import ProjectsList from '@/components/ProjectsList';
import ProjectTemplates from '@/components/ProjectTemplates';
import SmartBar from '@/components/SmartBar';
import { TitleThing } from '@/components/TitleThing';
import { actions, store } from '@/lib/store';
import TopBar from './components/TopRibbon';

//// Feature Flags
const hideTemplatesAtProjectCount = 12;
////

export default function Home() {
  useEffect(() => {
    actions.refreshProjects().then(() => {
      store.uiState.showTemplates = store.projects !== null && store.projects.length < hideTemplatesAtProjectCount;

      if (store.configuration.editors.length > 0) {
        store.selectedEditorIndex = 0;
      }
    });
  }, []);

  return (
    <main className="bg-gray-900 min-h-screen flex flex-col justify-start items-center animate-fade-in">
      <TopBar />
      <div className="flex flex-col min-h-screen text-white w-full max-w-screen-md mx-auto animate-fade-in">
        <div className="flex-grow p-5 mt-16">
          <TitleThing />

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
    </main>
  );
}
