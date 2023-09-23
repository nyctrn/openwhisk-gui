import { dataProvider } from "@/api/dataProvider";
import { Select, MenuItem, Box } from "@mui/material";
import { useCallback, useState } from "react";
import { useDataProvider, useGetList } from "react-admin";
import { Handle, Position, useReactFlow } from "reactflow";
import { useQuery } from "react-query";

const handleStyle = { width: "10px", height: "10px" };

function TextUpdaterNode({ data, isConnectable, id, deleteElements }) {
  // const { data: actionsData = [] } = useQuery({
  //   queryKey: ["actions"],
  //   queryFn: () => dataProvider.getList("actions", null).then((res) => res),
  // });

  const { data: actionsData } = useGetList("actions");

  const { getNodes, setNodes } = useReactFlow();

  const nodes = getNodes();

  const foundNode = nodes?.find((node) => node.id === id);

  const [action, setAction] = useState("");

  // const onChange = useCallback((evt) => {}, []);

  const handleChange = (e) => {
    setAction(e.target.value);

    const updatedNodes = nodes.map((node) => {
      if (node.id === id) {
        return {
          ...node,
          data: { action: e.target.value },
        };
      }
      return node;
    });

    setNodes(updatedNodes);
  };

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        id="a"
        style={handleStyle}
        isConnectable={isConnectable}
      />

      <Box
        className="text-updater-node"
        sx={{ display: "flex", flexDirection: "column", minWidth: "200px" }}
      >
        <span>Action</span>
        <Select
          className="nodrag"
          onChange={handleChange}
          value={action}
          displayEmpty
        >
          <MenuItem value="">{foundNode?.data.action}</MenuItem>
          {actionsData?.map((action) => {
            console.log(action, "ACTION");

            return (
              <MenuItem key={action.name} value={action.name}>
                {action.name || foundNode?.data.action}
              </MenuItem>
            );
          })}
        </Select>
      </Box>

      <Handle
        type="source"
        position={Position.Right}
        id="b"
        style={handleStyle}
        isConnectable={isConnectable}
      />
    </>
  );
}

export default TextUpdaterNode;
