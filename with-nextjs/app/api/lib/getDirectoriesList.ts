import fs from 'fs/promises';
import os from 'os';
import path from 'path';

export async function getProjectDirectoriesList(basePath: string = 'workspace'): Promise<string[]> {
  const workspacePath = path.join(os.homedir(), basePath);
  const entries = await fs.readdir(workspacePath, { withFileTypes: true });

  return entries.filter(entry => entry.isDirectory()).map(entry => entry.name);
}
