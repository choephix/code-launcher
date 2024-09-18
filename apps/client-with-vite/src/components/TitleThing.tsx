import { useStore } from '@/lib/store';

//// Feature Flags
const useDynamicTitle = false;
////

export function TitleThing() {
  const { titleContent, titleStyle } = getTitleContentAndStyle();

  return (
    <h1 className="text-md font-bold text-center text-blue-400 mb-4 mt-8 font-mono" style={titleStyle}>
      {titleContent}
    </h1>
  );
}

function getTitleContentAndStyle() {
  const { activeSmartBarFeature } = useStore();

  // const defaultTitleContent = '{code:launcher}';
  const defaultTitleContent = 'code:launcher';

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
