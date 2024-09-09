import { NextResponse } from 'next/server';

import { getProjectDirectoriesList } from '../lib/getDirectoriesList';
import { getMemoryAndCPU } from '../lib/getMemoryAndCPU';

export const dynamic = 'force-dynamic';

export async function GET() {
  const projects = await getProjectDirectoriesList();

  const { cpuUsage, memUsage } = getMemoryAndCPU();

  return NextResponse.json({
    projects,
    stats: { cpuUsage: cpuUsage, memUsage: memUsage },
  });
}
