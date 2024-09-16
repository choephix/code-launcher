import { useStore, store } from '../store';

const SELECTED_EDITOR_KEY = 'selectedEditorIndex';

export function getSelectedEditorIndexFromLocalStorage(): number {
  const storedIndex = localStorage.getItem(SELECTED_EDITOR_KEY);
  return storedIndex ? parseInt(storedIndex, 10) : 0;
}

function setSelectedEditorIndexToLocalStorage(index: number): void {
  localStorage.setItem(SELECTED_EDITOR_KEY, index.toString());
}

export function useSelectedEditor() {
  const { configuration, selectedEditorIndex } = useStore();

  if (!configuration) {
    return {
      editors: [],
      selectedEditor: null,
      setSelectedEditorIndex: () => console.error('No configuration found'),
    };
  }

  const editors = configuration.editors ?? [];
  const selectedEditor = editors[selectedEditorIndex];

  const setSelectedEditorIndex = (index: number) => {
    store.selectedEditorIndex = index;
    setSelectedEditorIndexToLocalStorage(index);
  };

  return {
    editors,
    selectedEditor,
    setSelectedEditorIndex,
  };
}

// Initialize the store with the saved index
store.selectedEditorIndex = getSelectedEditorIndexFromLocalStorage();
