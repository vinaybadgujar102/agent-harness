export type ToolCall = {
  id?: string;
  name?: string; // name of the tool we defined in registry
  args?: Record<string, unknown>; // the parameters and values in json format
};
