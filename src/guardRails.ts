import { GoogleGenAI } from "@google/genai/node";
import { createInitialHistory, runLoopStep } from "./whileLoop";

export function assertWithinMaxSteps(nextStep: number, maxStep: number) {
  if (maxStep < 1) {
    throw new Error("Max step should be a positive integer");
  }

  if (nextStep > maxStep) {
    throw new Error("Max step exceded");
  }
}
export async function runWithGuardRails(
  prompt: string,
  maxSteps = 5,
  apiKey = process.env.GEMINI_API_KEY,
) {
  const ai = new GoogleGenAI({
    apiKey,
  });

  const history = createInitialHistory(prompt);
  let stepsTaken = 0;

  while (true) {
    assertWithinMaxSteps(stepsTaken + 1, maxSteps);
    stepsTaken += 1;
    const step = await runLoopStep(prompt, history);

    if (step.kind === "final") {
      return {
        finalText: step?.finalText,
      };
    }
  }
}
