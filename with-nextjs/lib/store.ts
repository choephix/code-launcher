import { proxy } from 'valtio';

interface State {
  commandResult: any;
  projects: string[];
}

export const store = proxy<State>({
  commandResult: null,
  projects: [],
});

export const actions = {
  setCommandResult: (result: any) => {
    store.commandResult = result;
  },
  setProjects: (projects: string[]) => {
    store.projects = projects;
  },
  refreshProjects: async () => {
    const response = await fetch('/api/ls');
    const data = await response.json();
    store.projects = data.projects;
  },
};
