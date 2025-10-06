export type ToolDef = {
  name: string;
  description: string;
  params: Record<string, string>; // nom→description
  handler: (args: Record<string, any>) => Promise<any>;
};

export const tools: ToolDef[] = [];

export function register(tool: ToolDef) {
  tools.push(tool);
}

export function listTools() {
  return tools.map(({ handler, ...meta }) => meta);
}

export function findTool(name: string): ToolDef | undefined {
  return tools.find(tool => tool.name === name);
}