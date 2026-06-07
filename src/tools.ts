import type { ToolCall } from "./types.ts";
import { GoogleGenAI, Type } from "@google/genai";
import { BASE_SYSTEM_INSTRUCTION } from "./whileLoop";
export const MODEL = "gemini-2.5-flash";

type ToolDefination<Input extends Record<string, unknown>, Output> = {
  declaration: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
  run(input: Input): Output | Promise<Output>;
};

export const toolRegistry = {
  add_numbers: {
    declaration: {
      name: "add_numbers",
      description: "Add two numbers and return the sum.",
      parameters: {
        type: Type.OBJECT,
        properties: {
          a: { type: Type.NUMBER, description: "First number." },
          b: { type: Type.NUMBER, description: "Second number." },
        },
        required: ["a", "b"],
      },
    },
    run({ a, b }: { a: number; b: number }) {
      return { sum: a + b };
    },
  },
  get_current_time: {
    declaration: {
      name: "get_current_time",
      description: "Return the current local time in ISO format.",
      parameters: {
        type: Type.OBJECT,
        properties: {},
      },
    },
    run() {
      return { now: new Date().toISOString() };
    },
  },
} satisfies Record<string, ToolDefination<Record<string, unknown>, unknown>>;

export type ToolName = keyof typeof toolRegistry;

export const functionDeclarations = Object.values(toolRegistry).map(
  (tool) => tool.declaration,
);

function isToolName(name: string | undefined): name is ToolName {
  return Boolean(name && name in toolRegistry);
}

export async function runTool(call: ToolCall) {
  if (!isToolName(call.name)) {
    throw new Error("Unknow tool call");
  }

  const tool = toolRegistry[call.name] as ToolDefination<
    Record<string, unknown>,
    unknown
  >;

  return tool.run(call.args ?? {});
}

export class ToolHarness {
  private ai: GoogleGenAI;

  constructor(apiKey = process.env.GEMINI_API_KEY) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  async askOnce(prompt: string) {
    const response = await this.ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        systemInstruction: BASE_SYSTEM_INSTRUCTION,
        tools: [{ functionDeclarations }],
      },
    });

    const calls = (response.functionCalls ?? []) as ToolCall[];

    const toolResult = [];
    for (const call of calls) {
      toolResult.push({
        name: call.name,
        args: call.args,
        result: await runTool(call),
      });
    }
    return {
      text: response.text ?? "",
      toolResult,
    };
  }
}
