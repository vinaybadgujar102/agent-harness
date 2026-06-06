type PayloadPanelProps = {
  title: string;
  payload: unknown;
};

function highlightJson(value: unknown, indent = 0): string {
  const pad = "  ".repeat(indent);

  if (value === null) {
    return `<span class="payload-null">null</span>`;
  }

  if (typeof value === "string") {
    const escaped = value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    return `<span class="payload-string">"${escaped}"</span>`;
  }

  if (typeof value === "number") {
    return `<span class="payload-number">${value}</span>`;
  }

  if (typeof value === "boolean") {
    return `<span class="payload-bool">${value}</span>`;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    const items = value
      .map(
        (item) =>
          `${"  ".repeat(indent + 1)}${highlightJson(item, indent + 1)}`,
      )
      .join(",\n");
    return `[\n${items}\n${pad}]`;
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return "{}";
    const props = entries
      .map(([key, val]) => {
        return `${"  ".repeat(indent + 1)}<span class="payload-key">"${key}"</span>: ${highlightJson(val, indent + 1)}`;
      })
      .join(",\n");
    return `{\n${props}\n${pad}}`;
  }

  return String(value);
}

export function PayloadPanel({ title, payload }: PayloadPanelProps) {
  const isString = typeof payload === "string";

  return (
    <div className="panel-card payload-panel">
      <div className="panel-card-header">{title}</div>
      <div className="panel-card-body">
        {isString ? (
          <pre>
            <span className="payload-string">"{payload}"</span>
          </pre>
        ) : (
          <pre
            dangerouslySetInnerHTML={{
              __html: highlightJson(payload),
            }}
          />
        )}
      </div>
    </div>
  );
}
