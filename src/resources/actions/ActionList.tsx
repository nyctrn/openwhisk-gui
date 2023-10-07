import { CircularProgress } from "@mui/material";
import {
  List,
  TextField,
  DateField,
  useLoading,
  DatagridConfigurable,
  CloneButton,
  useListContext,
  FunctionField,
  SearchInput,
} from "react-admin";
import { ListActions, PageWrapper, ActionKindIcon } from "@/components";
import { CopyAllSharp as CloneIcon } from "@mui/icons-material";

const CustomDatagridConfigurable = () => {
  const { isFetching } = useListContext();

  if (isFetching) {
    return <CircularProgress />;
  }

  return (
    <DatagridConfigurable rowClick="edit">
      <TextField source="name" sortable={false} />
      <TextField source="namespace" sortable={false} />
      <FunctionField
        key={1}
        render={(record: any) => {
          const execAnnotation = record.annotations.find(
            (annotation: { key: string; value: any }) =>
              annotation.key === "exec"
          );

          return <ActionKindIcon execValue={execAnnotation.value} />;
        }}
        label="Kind"
        sortable={false}
      />

      <TextField
        source="limits.concurrency"
        label="Concurrency limit (N)"
        sortable={false}
      />
      <TextField source="limits.logs" label="Logs limit (N)" sortable={false} />
      <TextField
        source="limits.memory"
        label="Memory limit (MB)"
        sortable={false}
      />
      <TextField
        source="limits.timeout"
        label="Timeout limit (ms)"
        sortable={false}
      />
      <DateField
        source="updated"
        showTime
        locales="en-GB"
        sortable={false}
        label="Updated At"
      />
      <TextField source="version" sortable={false} />
      <TextField source="publish" sortable={false} label="Shared" />

      <CloneButton icon={<CloneIcon />} />
    </DatagridConfigurable>
  );
};

const ActionList = () => {
  const isLoading = useLoading();

  return (
    <PageWrapper>
      <List
        filters={[<SearchInput source="q" key="search" alwaysOn />]}
        actions={<ListActions withCreateBtn />}
        empty={false}
      >
        <CustomDatagridConfigurable />
      </List>
    </PageWrapper>
  );
};

export default ActionList;
