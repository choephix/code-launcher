import { NextResponse } from 'next/server';

import { CodeLauncherServerActions } from '@code-launcher/shell-operations';

export async function POST(request: Request) {
  const { command } = await request.json();

  const result = await CodeLauncherServerActions.runCommand(command);
  return NextResponse.json(result);
}
