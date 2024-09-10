import path from 'path';

export const pathToWorkspaces = path.resolve(process.env.CODELAUNCHER_WORKSPACE_PATH || '.');
