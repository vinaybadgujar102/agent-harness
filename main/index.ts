import {
  GoogleGenAI,
  Type,
  type FunctionDeclaration,
} from "@google/genai/node";
import { MODEL } from "./constants";
import type { FunctionCall } from "@google/genai/node";

type Part = Record<string, unknown>;

type Message = {
  role: "user" | "model";
  parts: Part[];
};

function generateFunctionResponsePart(
  toolCall: FunctionCall,
  result: Record<string, unknown>,
) {
  return {
    name: toolCall.name,
    response: { result },
    id: toolCall.id,
  };
}

const getCurrentTime: FunctionDeclaration = {
  name: "get_current_time",
  description: "Return the current local time in ISO format",
  parameters: {
    type: Type.OBJECT,
    properties: {},
  },
};

const functionDeclarations: FunctionDeclaration[] = [getCurrentTime];

function generateInitialMessage(prompt: string): Message[] {
  return [{ role: "user", parts: [{ text: prompt }] }];
}

export class AgentLoop {
  private ai: GoogleGenAI;

  constructor(api = process.env.GEMINI_API_KEY) {
    if (!api) throw new Error("Please provide gemini api key");

    this.ai = new GoogleGenAI({ apiKey: api });
  }

  async runLoop(prompt: string) {
    const messages = generateInitialMessage(prompt);
    console.log("message = ", JSON.stringify(messages));

    while (true) {
      const response = await this.ai.models.generateContent({
        model: MODEL,
        contents: messages,
        config: {
          systemInstruction:
            "You are helpful agent which solves user query. Use tool when necessary",
          tools: [{ functionDeclarations }],
        },
      });

      // [
      //  {
      //    name: "get_current_time",
      //    id: tool_id,
      //    args: {parameterName: value}
      //  }
      // ]
      const calls = (response.functionCalls ?? []) as FunctionCall[];

      // if no furthur function call returned by the llm, exit the loop
      if (calls.length === 0) {
        console.log({
          kind: "final",
          finalText: response.text ?? "",
        });
        break;
      }
      // {role: "model", parts:[{"text": thoughtSignature returend by the model}]}
      messages.push(response.candidates[0]?.content);
      // [
      //  { functionResponse:
      //    {
      //      name: toolName,
      //      response: { response },
      //      id: tool_id
      //    }
      //  }
      // ]
      const toolResultParts: Part[] = [];

      for (const call of calls) {
        if (call.name === "get_current_time") {
          const response = new Date();
          const result = { currentTime: response };
          toolResultParts.push({
            functionResponse: generateFunctionResponsePart(call, result),
          });
        }
      }
      console.log(JSON.stringify(toolResultParts));
      messages.push({ role: "user", parts: toolResultParts });
    }

    /*
toolResultParts = [
  {
    "functionResponse": {
      "name": "get_current_time",
      "response": {
        "result": {
          "currentTime": "2026-06-07T07:19:43.039Z"
        }
      }
    }
  }
]
*/
    const finalResponse = await this.ai.models.generateContent({
      model: MODEL,
      contents: messages,
      config: {
        systemInstruction:
          "You are helpful agent which solves user query. Use tool when necessary",
        tools: [{ functionDeclarations }],
      },
    });
    console.log(finalResponse.text);
  }
}

const harness = new AgentLoop();
harness.runLoop("What's the current time?");
