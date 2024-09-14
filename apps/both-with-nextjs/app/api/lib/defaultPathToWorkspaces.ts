import path from 'path';

export const defaultPathToWorkspaces = path.resolve(process.env.CODELAUNCHER_WORKSPACE_PATH || '.');
