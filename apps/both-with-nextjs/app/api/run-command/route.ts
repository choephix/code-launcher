import { NextResponse } from 'next/server';

import { createCodeLauncherServerActions } from '@code-launcher/shell-operations';
import { defaultPathToWorkspaces } from '../lib/defaultPathToWorkspaces';

export async function POST(request: Request) {
  const { command } = await request.json();

  const CodeLauncherServerActions = createCodeLauncherServerActions(defaultPathToWorkspaces);
  const result = await CodeLauncherServerActions.runCommand(command);
  return NextResponse.json(result);
}
