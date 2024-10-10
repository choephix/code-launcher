import { useCallback } from 'react';
import { apiService } from '@/lib/apiService';
import { useStore } from '@/lib/store';

export const useOpenEditorAt = () => {
  const { configuration, selectedEditorIndex, pathToWorkspaces } = useStore();

  const openEditorAt = useCallback(
    async (project: string) => {
      if (!configuration) {
        throw new Error('Configuration not loaded');
      }

      const editorCfg = configuration.editors[selectedEditorIndex];
      if (!editorCfg) {
        console.warn({ editors: configuration.editors, selectedEditorIndex });
        throw new Error('No editor configuration found');
      }

      if (editorCfg.urlTemplate) {
        const url = editorCfg.urlTemplate
          .replace('{path}', `${pathToWorkspaces}/${project}`)
          .replace('{address}', location.hostname);
        window.open(url, '_blank');
        return;
      }

      if (editorCfg.shellExecutable) {
        const command = `"${editorCfg.shellExecutable}" "${pathToWorkspaces}/${project}"`;
        await apiService.runCommand(command);
        return;
      }

      console.warn({ editorCfg });
      throw new Error('Editor configuration has neither urlTemplate nor shellExecutable');
    },
    [configuration, selectedEditorIndex, pathToWorkspaces]
  );

  return openEditorAt;
};
