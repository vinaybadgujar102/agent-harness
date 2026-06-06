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
          <div
            key={step.id}
            className={[
              "pipeline-step",
              isActive ? "active" : "",
              isCompleted ? "completed" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <div className="pipeline-step-marker">
              <div className="pipeline-dot" />
              {!isLast && (
                <div className="pipeline-connector">
                  <svg viewBox="0 0 2 40" preserveAspectRatio="none">
                    <line
                      x1="1"
                      y1="0"
                      x2="1"
                      y2="40"
                      className="pipeline-connector-line"
                    />
                  </svg>
                  {isActive && <div className="pipeline-packet" />}
                </div>
              )}
            </div>
            <div className="pipeline-step-content">
              <div className="pipeline-step-label">
                {step.id}. {step.label}
              </div>
              {isActive && (
                <>
                  <p className="pipeline-step-desc">{step.description}</p>
                  <span className="pipeline-step-ref">{step.codeRef}</span>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
