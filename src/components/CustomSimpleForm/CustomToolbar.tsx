import { DeleteButton, Toolbar, ToolbarProps } from "react-admin";
import CustomSaveButton from "./CustomSaveButton";
import { useHasRecord } from "@/utils";

const CustomToolBar = (props: ToolbarProps) => (
  <Toolbar
    {...props}
    sx={{ justifyContent: useHasRecord() ? "space-between" : "center" }}
  >
    <CustomSaveButton />
    <DeleteButton icon={<></>} />
  </Toolbar>
);

export default CustomToolBar;
