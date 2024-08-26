import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import os from 'os';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  const workspacePath = path.join(os.homedir(), 'workspace');
  const folders = await fs.readdir(workspacePath, { withFileTypes: true });
  const projects = folders.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);

  return NextResponse.json({ projects });
}
