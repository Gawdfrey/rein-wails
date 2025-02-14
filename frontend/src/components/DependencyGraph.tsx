import { useCallback } from "react";
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  Controls,
  NodeTypes,
  Handle,
  Position,
  NodeMouseHandler,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

interface DependencyGraphProps {
  moduleName: string;
  dependencies: string[];
}

const CustomNode = ({
  data,
}: {
  data: { label: string; isMain?: boolean };
}) => (
  <div
    className={`px-4 py-2 rounded-lg shadow-sm border ${
      data.isMain ? "bg-blue-50 border-blue-200" : "bg-white border-gray-200"
    }`}
  >
    <Handle type="target" position={Position.Top} className="!bg-gray-400" />
    <div className="text-sm font-medium text-gray-700">{data.label}</div>
    <Handle type="source" position={Position.Bottom} className="!bg-gray-400" />
  </div>
);

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

export function DependencyGraph({
  moduleName,
  dependencies,
}: DependencyGraphProps) {
  // Create nodes: main module at the top, dependencies below
  const nodes: Node[] = [
    {
      id: "main",
      type: "custom",
      position: { x: 0, y: 0 },
      data: { label: moduleName, isMain: true },
    },
    ...dependencies.map((dep, index) => ({
      id: `dep-${index}`,
      type: "custom",
      position: {
        x: (-(dependencies.length - 1) / 2 + index) * 200,
        y: 150,
      },
      data: { label: dep },
    })),
  ];

  // Create edges from main module to each dependency
  const edges: Edge[] = dependencies.map((_, index) => ({
    id: `edge-${index}`,
    source: "main",
    target: `dep-${index}`,
    type: "smoothstep",
    animated: true,
    style: { stroke: "#94a3b8" },
  }));

  const onNodeClick: NodeMouseHandler = useCallback((_, node) => {
    console.log("click", node);
  }, []);

  return (
    <div className="h-[300px] w-full border border-gray-200 rounded-lg">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
        attributionPosition="bottom-right"
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
