import { NextResponse } from 'next/server';

import { createCodeLauncherServerActions } from '@code-launcher/shell-operations';
import { defaultPathToWorkspaces } from '../lib/defaultPathToWorkspaces';

export const dynamic = 'force-dynamic';

export async function GET() {
  const CodeLauncherServerActions = createCodeLauncherServerActions(defaultPathToWorkspaces);
  const result = await CodeLauncherServerActions.getProjectDirectoriesList();
  return NextResponse.json(result);
}
