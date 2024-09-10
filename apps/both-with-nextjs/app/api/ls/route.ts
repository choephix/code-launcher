import { NextResponse } from 'next/server';

import { CodeLauncherServerActions } from '@code-launcher/shell-operations';

export const dynamic = 'force-dynamic';

export async function GET() {
  const result = await CodeLauncherServerActions.getProjectDirectoriesList();
  return NextResponse.json(result);
}
