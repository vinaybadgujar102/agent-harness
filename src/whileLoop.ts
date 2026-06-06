import { GoogleGenAI } from "@google/genai/node";
import type { ToolCall } from "./types";
import {
  firePostHooks,
  firePreHooks,
  type HookContext,
  type Hooks,
} from "./lifeCycleHooks";

export type Part = Record<string, unknown>[];

export type Message = {
  role: "user" | "model";
  parts: Part;
};

export type LoopStep =
  | { kind: "final"; finalText: string }
  | { kind: "tool-results"; toolCalls: number };

export const BASE_SYSTEM_INSTRUCTION =
  "You are a tiny harness demo. Use tools, read their results, then answer.";

export function createInitialHistory(prompt: string): Message[] {
  return [
    {
      role: "user",
      parts: [{ text: prompt }],
    },
  ];
}

function functionResponsePart(call: ToolCall, result: unknown) {
  const functionResponse: Record<string, unknown> = {
    name: call.name,
    response: { result },
  };

  if (call.id) {
    functionResponse.id = call.id;
  }

  return { functionResponse };
}

export async function runLoopStep(
  ai: GoogleGenAI, // pass the ai provider we using, currently only supporting gemini, many can be added later
  history: Message[], // the collection of messages doing back and forth with llm
  systemInstruction = BASE_SYSTEM_INSTRUCTION,
  hooks?: Hooks,
) {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: history,
    config: {
      systemInstruction,
      tools: [{ functionDeclarations }],
    },
  });

  // check if llm responds with function call and the related data
  const calls = (response.functionCalls ?? []) as ToolCall[];

  // we exit the loop as no more tool calls needed
  if (calls.length === 0) {
    // here we return a strucuted event that this is final reponse with the responsed text by llm
    return {
      kind: "final",
      finalText: response.text ?? "",
    };
  }

  // this is bascially model thinking part. before actually calling the
  // tool it must have thought right. that is this part. so we first push
  // the thinking then the actuall function call response
  const modelContent = response.candidates[0]?.content;

  if (modelContent) {
    history.push(modelContent as Message);
  }

  const toolResultPart = [];

  // llm may have responed with multiple tools to call so we have to call
  // each one and store its response
  for (const call of calls) {
    // context we give to the hooks to let them know which tool and its result
    const context: HookContext = { tool: call };
    const decision = await firePreHooks(hooks, context);
    if (decision === "deny") {
      toolResultPart.push(
        functionResponsePart(call, { error: "Tool call denied." }),
      );
      continue;
    }

    // we run that tool
    const result = await runTool(call);
    context.result = result;
    await firePostHooks(hooks, context);
    // store its result and then run the next iteration
    toolResultPart.push(functionResponsePart(call, result));
  }

  // push the tool results in messages
  history.push({ role: "user", parts: toolResultPart });
}

// const agent = new LoopHarness();;
// agent.run("Check the weather of Erandol");
// earlier in normal way, we direclty were calling function step by step
// but here we created better structure.
// Encapsulate the model client creation and its behaviour in a class
// so what the harness class basically needs. way to create agent client
// and to run the prompt
export class LoopHarness {
  private ai: GoogleGenAI;

  constructor(apiKey = process.env.GEMINI_API_KEY) {
    if (!apiKey) {
      throw new Error("Set GEMINI_API_KEY before calling Gemini.");
    }

    this.ai = new GoogleGenAI({ apiKey });
  }

  // this is agent behaviour asking it to run the query
  async run(prompt: string) {
    // as we are running loop we have to keep adding the messages responsed by agent
    // for the llm to get the context so we store it as array of structured messages
    // with specfic format. this line below creates that format with initial user prompt
    const history = createInitialHistory(prompt);

    // runninng the loop
    while (true) {
      // one llm call = can be normal call, can be tool call.
      // we can call this a turn.
      // this runloopstep only returns final when there is no tool call
      // so this loop will keep running if the runloopstep keeps calling tools
      const step = await runLoopStep(this.ai, history);

      if (step.kind === "final") {
        return {
          finalText: step.finalText,
        };
      }
    }
  }
}
