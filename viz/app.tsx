import { createRoot } from "react-dom/client";
import { FlowVisualization } from "./FlowVisualization";
import "./styles.css";

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<FlowVisualization />);
}
