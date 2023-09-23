import { SelectColumnsButton, CreateButton, TopToolbar } from "react-admin";

type ListActionsProps = {
  withCreateBtn?: boolean;
};

const ListActions = ({ withCreateBtn }: ListActionsProps) => (
  <TopToolbar>
    {withCreateBtn && <CreateButton />}
    <SelectColumnsButton />
  </TopToolbar>
);

export default ListActions;
