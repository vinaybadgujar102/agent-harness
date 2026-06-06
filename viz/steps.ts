export type Message = {
  role: "user" | "model";
  parts: Record<string, unknown>[];
};

export type FlowStep = {
  id: number;
  label: string;
  description: string;
  codeRef: string;
  messages: Message[];
  payloadTitle: string;
  payload: unknown;
  newMessageIndex?: number;
};

const PROMPT = "What's the current time?";

const SYSTEM_INSTRUCTION =
  "You are a tiny harness demo. Use tools, read their results, then answer.";

const FUNCTION_DECLARATIONS = [
  {
    name: "get_current_time",
    description: "Return the current local time in ISO format.",
    parameters: { type: "OBJECT", properties: {} },
  },
];

const initialMessage: Message = {
  role: "user",
  parts: [{ text: PROMPT }],
};

const modelToolCall: Message = {
  role: "model",
  parts: [
    {
      functionCall: {
        name: "get_current_time",
        args: {},
      },
    },
  ],
};

const toolResult = { now: "2026-06-07T12:00:00.000Z" };

const userToolResponse: Message = {
  role: "user",
  parts: [
    {
      functionResponse: {
        name: "get_current_time",
        response: { result: toolResult },
      },
    },
  ],
};

export const FLOW_STEPS: FlowStep[] = [
  {
    id: 1,
    label: "Raw prompt",
    description: "The user types a plain string — no structure yet.",
    codeRef: "user input",
    messages: [],
    payloadTitle: "Plain string",
    payload: PROMPT,
  },
  {
    id: 2,
    label: "Structure",
    description: "createInitialHistory() wraps the prompt into Gemini's message format.",
    codeRef: "createInitialHistory()",
    messages: [initialMessage],
    payloadTitle: "Message[]",
    payload: [initialMessage],
    newMessageIndex: 0,
  },
  {
    id: 3,
    label: "API request",
    description:
      "generateContent() sends the history, system instruction, and tool declarations to Gemini.",
    codeRef: "runLoopStep() → generateContent()",
    messages: [initialMessage],
    payloadTitle: "generateContent request",
    payload: {
      model: "gemini-2.5-flash",
      contents: [initialMessage],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ functionDeclarations: FUNCTION_DECLARATIONS }],
      },
    },
  },
  {
    id: 4,
    label: "Model response",
    description:
      "The LLM decides to call a tool instead of answering directly. response.functionCalls is populated.",
    codeRef: "response.functionCalls",
    messages: [initialMessage],
    payloadTitle: "LLM response (tool call)",
    payload: {
      functionCalls: [
        {
          name: "get_current_time",
          args: {},
        },
      ],
      candidates: [
        {
          content: modelToolCall,
        },
      ],
    },
  },
  {
    id: 5,
    label: "History grows",
    description:
      "The model's functionCall turn is pushed onto history so the LLM retains context.",
    codeRef: "history.push(modelContent)",
    messages: [initialMessage, modelToolCall],
    payloadTitle: "Pushed model turn",
    payload: modelToolCall,
    newMessageIndex: 1,
  },
  {
    id: 6,
    label: "Tool execution",
    description:
      "runTool() executes get_current_time from the registry and builds a functionResponse part.",
    codeRef: "runTool() → functionResponsePart()",
    messages: [initialMessage, modelToolCall],
    payloadTitle: "Tool result",
    payload: {
      call: { name: "get_current_time", args: {} },
      result: toolResult,
      functionResponsePart: userToolResponse.parts[0],
    },
  },
  {
    id: 7,
    label: "History grows again",
    description:
      "Tool results are pushed as a synthetic user turn with functionResponse parts.",
    codeRef: 'history.push({ role: "user", parts: toolResultPart })',
    messages: [initialMessage, modelToolCall, userToolResponse],
    payloadTitle: "Pushed user turn (tool results)",
    payload: userToolResponse,
    newMessageIndex: 2,
  },
  {
    id: 8,
    label: "Final answer",
    description:
      "A second generateContent() call with full history returns text. The loop exits with kind: final.",
    codeRef: 'return { kind: "final", finalText }',
    messages: [initialMessage, modelToolCall, userToolResponse],
    payloadTitle: "Loop result",
    payload: {
      kind: "final",
      finalText:
        "The current time is June 7, 2026 at 12:00 PM UTC (2026-06-07T12:00:00.000Z).",
    },
  },
];

export const STEP_INTERVAL_MS = 2500;
