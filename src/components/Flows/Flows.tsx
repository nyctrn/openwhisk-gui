import React, { useState, useCallback, useEffect } from "react";
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  Panel,
} from "reactflow";
import TextUpdaterNode from "./TextUpdaterNode";
import { dataProvider } from "@/api/dataProvider";
import { useMutation } from "react-query";

import "reactflow/dist/style.css";

const flowKey = "example-flow";

const getNodeId = () => `randomnode_${+new Date()}`;

const initialNodes = [
  { id: "1", data: { label: "Node 1" }, position: { x: 100, y: 100 } },
  { id: "2", data: { label: "Node 2" }, position: { x: 100, y: 200 } },
];

const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

const nodeTypes = { textUpdater: TextUpdaterNode };

const extractActions = (nodes) => nodes.map((node) => node.data.action);

function getSequenceFromEdges(edges) {
  const nodesMap = new Map();

  edges.forEach((edge) => {
    nodesMap.set(edge.source, true);
    nodesMap.set(edge.target, true);
  });

  const sequence = [];
  const visitedNodes = new Set();

  const visitNode = (node) => {
    if (!visitedNodes.has(node)) {
      visitedNodes.add(node);
      sequence.push(node);
      edges.forEach((edge) => {
        if (edge.source === node) {
          visitNode(edge.target);
        }
      });
    }
  };

  edges.forEach((edge) => {
    if (!nodesMap.get(edge.sourceHandle)) {
      visitNode(edge.source);
    }
  });

  return sequence;
}

function matchActionWithId(nodes, sequence) {
  const idToActionMap = new Map();

  nodes.forEach((node) => {
    idToActionMap.set(node.id, node.data.action);
  });

  const matchedActions = sequence.map((nodeId) => {
    return idToActionMap.get(nodeId);
  });

  return matchedActions.join(", ");
}

const SaveRestore = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [rfInstance, setRfInstance] = useState(null);
  const { setViewport } = useReactFlow();

  const { mutate, isLoading, data, error } = useMutation(async () => {
    const sequence = matchActionWithId(nodes, getSequenceFromEdges(edges));

    const params = {
      data: {
        name: "test1",
        parameters: [],
        annotations: [],
        limits: [],
        exec: { kind: "sequence", components: sequence },
      },
    };

    const { data } = await dataProvider.create("actions", params);

    return data;
  });

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );
  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      localStorage.setItem(flowKey, JSON.stringify(flow));
    }
  }, [rfInstance]);

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const flow = JSON.parse(localStorage.getItem(flowKey));

      if (flow) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setViewport({ x, y, zoom });
      }
    };

    restoreFlow();
  }, [setNodes, setViewport]);

  const onAdd = useCallback(() => {
    const newNode = {
      id: getNodeId(),
      type: "textUpdater",
      style: { border: "1px solid #777", padding: 10 },
      data: { action: "" },
      position: {
        x: Math.random() * window.innerWidth - 100,
        y: Math.random() * window.innerHeight,
      },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onInit={setRfInstance}
      nodeTypes={nodeTypes}
      proOptions={{ hideAttribution: true }}
    >
      <Panel position="top-right">
        <button onClick={onSave}>save</button>
        <button onClick={onRestore}>restore</button>
        <button onClick={onAdd}>add node</button>
        <button onClick={() => mutate()}>create</button>
      </Panel>
    </ReactFlow>
  );
};

const Flow = () => (
  <ReactFlowProvider>
    <SaveRestore />
  </ReactFlowProvider>
);

export default Flow;
