import { AnimatePresence, motion } from "framer-motion";
import { springSnappy, springSoft } from "../motion";
import type { Message } from "../steps";

type MessagesPanelProps = {
  messages: Message[];
  highlightIndex?: number;
  stepKey: number;
};

function formatParts(parts: Record<string, unknown>[]): string {
  return JSON.stringify(parts, null, 2);
}

export function MessagesPanel({
  messages,
  highlightIndex,
  stepKey,
}: MessagesPanelProps) {
  return (
    <motion.div
      className="panel-card"
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springSoft}
    >
      <div className="panel-card-header">
        messages[]
        <motion.span
          key={messages.length}
          className="badge"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={springSnappy}
        >
          {messages.length} entries
        </motion.span>
      </div>
      <div className="panel-card-body">
        <div className="messages-list">
          <AnimatePresence mode="popLayout">
            {messages.length === 0 ? (
              <motion.p
                key="empty"
                className="messages-empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Empty — prompt not structured yet
              </motion.p>
            ) : (
              messages.map((msg, index) => (
                <motion.div
                  key={`${stepKey}-${msg.role}-${index}`}
                  layout
                  className={["message-card", msg.role].join(" ")}
                  initial={{ opacity: 0, y: 14, scale: 0.94 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    borderColor:
                      highlightIndex === index
                        ? "rgba(99, 102, 241, 0.9)"
                        : "rgba(42, 47, 61, 1)",
                    boxShadow:
                      highlightIndex === index
                        ? "0 0 20px rgba(99, 102, 241, 0.25)"
                        : "0 0 0px transparent",
                  }}
                  transition={{
                    ...springSoft,
                    delay: index * 0.07,
                    borderColor: { duration: 0.5 },
                    boxShadow: { duration: 0.5 },
                  }}
                >
                  <div className="message-role">{msg.role}</div>
                  <pre className="message-parts">{formatParts(msg.parts)}</pre>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
