export const runCommand = async (command: string) => {
  const response = await fetch('/api/run-command', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ command }),
  });
  const data = await response.json();
  return data as { commandOutput: string; cpuUsage: string; memUsage: string };
};

export const fetchProjects = async () => {
  const response = await fetch('/api/ls');
  const data = await response.json();
  return data as { projects: string[] };
};
