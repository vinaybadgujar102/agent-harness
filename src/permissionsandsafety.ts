// we can use this ass hook before tool call check if bash.
export type Permission = "read" | "workspace" | "full";

const rank: Record<Permission, number> = {
  read: 1,
  workspace: 2,
  full: 3,
};

const readCommands = new Set([
  "ls",
  "cat",
  "head",
  "grep",
  "find",
  "wc",
  "pwd",
]);
const fullCommands = new Set(["rm", "sudo", "mv", "kill", "shutdown", "dd"]);

export function classifyBash(command: string): Permission {
  const [program] = command.trim().split(/\s+/);

  if (!program || readCommands.has(program)) {
    return "read";
  }

  if (fullCommands.has(program)) {
    return "full";
  }

  return "workspace";
}

export function canDispatch(required: Permission, current: Permission) {
  return rank[current] >= rank[required];
}
