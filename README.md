# Agent Harness

A TypeScript-based agent runtime for building AI-powered applications with tool calling, execution control, and extensible orchestration capabilities.

The runtime provides the foundation for integrating large language models with external tools and services while maintaining a structured execution lifecycle.

---

## Features

* Tool and function calling
* Multi-step agent execution loop
* Conversation state management
* Extensible tool registry
* Structured message history
* Type-safe implementation with TypeScript
* Google Gemini integration
* Configurable execution flow

---

## Architecture

```text
┌─────────────┐
│ User Input  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Agent Loop  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│     LLM     │
└──────┬──────┘
       │
       ├──────────────► Final Response
       │
       ▼
┌─────────────┐
│ Tool Calls  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Tool Runner │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Tool Result │
└──────┬──────┘
       │
       └──────────────► Back to Agent Loop
```

---

## Project Structure

```text
.
├── main/
│   └── index.ts
├── package.json
├── tsconfig.json
└── README.md
```

The application entry point is located in `main/index.ts`.

---

## Prerequisites

* Node.js 20+
* Google Gemini API Key

---

## Installation

```bash
git clone https://github.com/vinaybadgujar102/agent-harness.git
cd agent-harness
npm install
```

---

## Configuration

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_api_key_here
```

---

## Running

```bash
npm run dev
```

Or:

```bash
npx tsx main/index.ts
```

---

## Extensibility

The runtime is designed to support:

* Custom tools
* Additional model providers
* Lifecycle hooks
* Guardrails and validation layers
* Human approval workflows
* Memory systems
* Multi-agent orchestration
* MCP integrations

---

## Roadmap

* Streaming support
* Pluggable memory layer
* Advanced tool permissions
* Agent lifecycle hooks
* Observability and tracing
* Model abstraction layer
* MCP client support

---

## License

MIT
