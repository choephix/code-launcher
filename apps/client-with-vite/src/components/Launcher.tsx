import ProjectsList from '@/components/ProjectsList';
import Footer from './Footer';
import ProjectTemplates from './ProjectTemplates';
import SmartBar from './SmartBar';

import { actions, store, useStore } from '@/lib/store';
import { useEffect } from 'react';

//// Feature Flags

const hideTemplatesAtProjectCount = 12;

const useDynamicTitle = false;

////

export default function Launcher() {
  useEffect(() => {
    actions.refreshProjects().then(() => {
      store.uiState.showTemplates = store.projects !== null && store.projects.length < hideTemplatesAtProjectCount;
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen text-white w-full max-w-screen-md mx-auto animate-fade-in">
      <div className="flex-grow p-5">
        <Title />

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

function Title() {
  const { titleContent, titleStyle } = getTitleContentAndStyle();

  return (
    <h1 className="text-md font-bold text-center text-blue-400 mb-4 mt-8 font-mono" style={titleStyle}>
      {titleContent}
    </h1>
  );
}

function getTitleContentAndStyle() {
  const { pathToWorkspaces, activeSmartBarFeature } = useStore();

  // const defaultTitleContent = '{code:launcher}';
  // const defaultTitleContent = 'code:launcher';
  const defaultTitleContent = pathToWorkspaces || 'code:launcher';

  if (!useDynamicTitle) {
    return {
      titleContent: defaultTitleContent,
      titleStyle: {},
    };
  }

  return {
    titleContent: activeSmartBarFeature?.bigTitle?.content || defaultTitleContent,
    titleStyle: activeSmartBarFeature?.bigTitle?.style || {},
  };
}
