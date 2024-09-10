import fs from 'fs/promises';
import os from 'os';
import path from 'path';

export async function getProjectDirectoriesList(basePath: string = 'workspace'): Promise<string[]> {
  try {
    const workspacePath = path.join(os.homedir(), basePath);
    const entries = await fs.readdir(workspacePath, { withFileTypes: true });

    return entries
      .filter(entry => entry.isDirectory())
      .filter(entry => !entry.name.startsWith('.'))
      .map(entry => entry.name);
  } catch (error) {
    console.error(`Error reading directory: ${error}`);
    return [];
  }
}
