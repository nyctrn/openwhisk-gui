import { useMediaQuery } from "@mui/material";
import { List, SimpleList, Datagrid, TextField } from "react-admin";
import { ListActions, PageWrapper } from "@/components";

const NamespaceList = () => {
  const isSmall = useMediaQuery((theme: any) => theme.breakpoints.down("sm"));
  return (
    <PageWrapper>
      <List actions={<ListActions />}>
        {isSmall ? (
          <SimpleList primaryText={(record) => record.name} />
        ) : (
          <Datagrid rowClick="edit">
            <TextField source="name" />
          </Datagrid>
        )}
      </List>
    </PageWrapper>
  );
};

export default NamespaceList;
