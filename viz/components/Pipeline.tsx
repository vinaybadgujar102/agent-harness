import { AnimatePresence, motion } from "framer-motion";
import { springSnappy, springSoft } from "../motion";
import type { FlowStep } from "../steps";

type PipelineProps = {
  steps: FlowStep[];
  currentIndex: number;
};

export function Pipeline({ steps, currentIndex }: PipelineProps) {
  return (
    <div className="pipeline">
      {steps.map((step, index) => {
        const isActive = index === currentIndex;
        const isCompleted = index < currentIndex;
        const isLast = index === steps.length - 1;

        return (
          <motion.div
            key={step.id}
            className="pipeline-step"
            animate={{
              opacity: isActive ? 1 : isCompleted ? 0.65 : 0.38,
              y: isActive || isCompleted ? 0 : 4,
            }}
            transition={springSoft}
          >
            <div className="pipeline-step-marker">
              <motion.div
                className="pipeline-dot"
                animate={{
                  scale: isActive ? 1.2 : 1,
                  backgroundColor: isActive || isCompleted ? "#6366f1" : "#2a2f3d",
                  borderColor: isActive || isCompleted ? "#6366f1" : "#2a2f3d",
                  boxShadow: isActive
                    ? "0 0 16px rgba(99, 102, 241, 0.45)"
                    : "0 0 0px transparent",
                }}
                transition={springSnappy}
              />
              {!isLast && (
                <div className="pipeline-connector">
                  <svg viewBox="0 0 2 40" preserveAspectRatio="none">
                    <motion.line
                      x1="1"
                      y1="0"
                      x2="1"
                      y2="40"
                      className="pipeline-connector-line"
                      animate={{
                        stroke: isActive || isCompleted ? "#6366f1" : "#2a2f3d",
                        opacity: isActive || isCompleted ? 0.55 : 0.35,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </svg>
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        className="pipeline-packet"
                        initial={{ top: "0%", opacity: 0, scale: 0.6 }}
                        animate={{
                          top: ["0%", "92%"],
                          opacity: [0, 1, 1, 0],
                          scale: [0.6, 1, 1, 0.6],
                        }}
                        exit={{ opacity: 0 }}
                        transition={{
                          duration: 1.4,
                          repeat: Infinity,
                          ease: "easeInOut",
                          times: [0, 0.12, 0.88, 1],
                        }}
                      />
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
            <div className="pipeline-step-content">
              <motion.div
                className="pipeline-step-label"
                animate={{ color: isActive ? "#6366f1" : "#e2e8f0" }}
                transition={{ duration: 0.25 }}
              >
                {step.id}. {step.label}
              </motion.div>
              <AnimatePresence mode="popLayout">
                {isActive && (
                  <motion.div
                    key={`detail-${step.id}`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={springSoft}
                    style={{ overflow: "hidden" }}
                  >
                    <motion.p
                      className="pipeline-step-desc"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05, ...springSoft }}
                    >
                      {step.description}
                    </motion.p>
                    <motion.span
                      className="pipeline-step-ref"
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1, ...springSnappy }}
                    >
                      {step.codeRef}
                    </motion.span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
