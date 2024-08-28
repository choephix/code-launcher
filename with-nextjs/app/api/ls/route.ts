import fs from 'fs/promises';
import { NextResponse } from 'next/server';
import os from 'os';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  const workspacePath = path.join(os.homedir(), 'workspace');
  const folders = await fs.readdir(workspacePath, { withFileTypes: true });
  const projects = folders.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);

  return NextResponse.json({ projects });
}
