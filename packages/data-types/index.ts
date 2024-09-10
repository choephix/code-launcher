export interface WorkspaceConfiguration {
  ui: {
    showTemplatesByDefault: boolean;
  },
  templates: {
    name: string;
    icon: string;
    command: string;
  }[];
}
