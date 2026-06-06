import type { Message } from "../steps";

type MessagesPanelProps = {
  messages: Message[];
  highlightIndex?: number;
};

function formatParts(parts: Record<string, unknown>[]): string {
  return JSON.stringify(parts, null, 2);
}

export function MessagesPanel({
  messages,
  highlightIndex,
}: MessagesPanelProps) {
  return (
    <div className="panel-card">
      <div className="panel-card-header">
        messages[]
        <span className="badge">{messages.length} entries</span>
      </div>
      <div className="panel-card-body">
        <div className="messages-list">
          {messages.length === 0 ? (
            <p className="messages-empty">Empty — prompt not structured yet</p>
          ) : (
            messages.map((msg, index) => (
              <div
                key={`${msg.role}-${index}`}
                className={[
                  "message-card",
                  msg.role,
                  highlightIndex === index ? "highlight" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="message-role">{msg.role}</div>
                <pre className="message-parts">{formatParts(msg.parts)}</pre>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
