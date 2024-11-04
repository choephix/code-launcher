import { useStore } from '@/lib/store';

//// Feature Flags
const useDynamicTitle = false;
////

export function TitleThing() {
  const { subtitleContent, subtitleStyle } = getSubTitleContentAndStyle();
  const hostname = window.location.hostname.replace(/\.local$/, '');

  return (
    <div className="text-center mb-4 mt-8">
      <h1 className="text-3xl font-semibold text-blue-500 mb-1" style={{ fontVariant: 'small-caps' }}>
        {hostname}
      </h1>{' '}
      <h2 className="text-sm font-bold text-blue-400 font-mono" style={subtitleStyle}>
        {subtitleContent}
      </h2>{' '}
    </div>
  );
}

function getSubTitleContentAndStyle() {
  const { activeSmartBarFeature } = useStore();

  // const defaultTitleContent = '{code:launcher}';
  const defaultContent = 'code:launcher';

  if (!useDynamicTitle) {
    return {
      subtitleContent: defaultContent,
      subtitleStyle: {},
    };
  }

  return {
    subtitleContent: activeSmartBarFeature?.bigTitle?.content || defaultContent,
    subtitleStyle: activeSmartBarFeature?.bigTitle?.style || {},
  };
}
