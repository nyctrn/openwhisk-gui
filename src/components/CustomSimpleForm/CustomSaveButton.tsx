import { useHasRecord } from "@/utils";
import { SaveButton, useResourceContext, SaveButtonProps } from "react-admin";
import { useQueryClient } from "react-query";

const CustomSaveButton = (props: SaveButtonProps) => {
  const resource = useResourceContext();

  const isEdit = useHasRecord();

  const queryClient = useQueryClient();

  return (
    <SaveButton
      icon={<></>}
      label={`${isEdit ? "Update" : "Create"} ${resource.slice(0, -1) ?? ""}`}
      onClick={() => {
        queryClient.invalidateQueries([resource]);
      }}
      alwaysEnable
      {...props}
    />
  );
};

export default CustomSaveButton;
