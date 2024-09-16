import { useStore, store } from '../store';

export function useSelectedEditor() {
  const { configuration, selectedEditorIndex } = useStore();

  if (!configuration) {
    return {
      editors: [],
      selectedEditor: null,
      setSelectedEditorIndex() {
        console.error('No configuration found');
      },
    };
  }

  const editors = configuration.editors ?? [];
  const selectedEditor = editors[selectedEditorIndex];

  return {
    editors,
    selectedEditor,
    setSelectedEditorIndex: (index: number) => {
      store.selectedEditorIndex = index;
    },
  };
}
