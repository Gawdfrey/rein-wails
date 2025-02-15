import { useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
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
import { ModuleDependency } from "../../bindings/changeme";

interface DependencyGraphProps {
  moduleName: string;
  dependencies: ModuleDependency[];
}

const CustomNode = ({
  data,
}: {
  data: { label: string; version?: string; isMain?: boolean };
}) => (
  <div
    className={`px-4 py-2 rounded-lg shadow-sm border transition-all ${
      data.isMain
        ? "bg-blue-50 border-blue-200"
        : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-md cursor-pointer"
    }`}
  >
    <Handle type="target" position={Position.Top} className="!bg-gray-400" />
    <div className="text-sm font-medium text-gray-700">{data.label}</div>
    {data.version && (
      <div className="text-xs text-gray-500">v{data.version}</div>
    )}
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
  const navigate = useNavigate();

  // Create nodes: main module at the top, dependencies below
  const nodes: Node[] = [
    {
      id: "main",
      type: "custom",
      position: { x: 0, y: 0 },
      data: { label: moduleName, isMain: true },
    },
    ...dependencies.map((dep, index) => ({
      id: dep.id,
      type: "custom",
      position: {
        x: (-(dependencies.length - 1) / 2 + index) * 250,
        y: 200,
      },
      data: {
        label: dep.name,
        version: dep.version,
      },
    })),
  ];

  // Create edges from main module to each dependency
  const edges: Edge[] = dependencies.map((dep, index) => ({
    id: `edge-${index}`,
    source: "main",
    target: dep.id,
    type: "smoothstep",
    animated: true,
    style: { stroke: "#94a3b8" },
  }));

  const onNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      if (node.id !== "main") {
        navigate({
          to: "/modules/$moduleId",
          params: { moduleId: node.id },
        });
      }
    },
    [navigate]
  );

  return (
    <div className="h-[300px] w-full border border-gray-200 rounded-lg">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.5}
        maxZoom={1.5}
        attributionPosition="bottom-right"
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
