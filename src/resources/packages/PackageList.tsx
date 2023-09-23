import { CircularProgress } from "@mui/material";
import {
  List,
  DatagridConfigurable,
  TextField,
  DateField,
  useLoading,
  CloneButton,
} from "react-admin";
import { PageWrapper } from "@/components";
import { CopyAllSharp as CloneIcon } from "@mui/icons-material";

const PackageList = () => {
  const isLoading = useLoading();

  return (
    <PageWrapper>
      <List exporter={false} empty={false}>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <DatagridConfigurable rowClick="edit">
            <TextField source="name" sortable={false} />
            <TextField source="namespace" sortable={false} />
            <DateField
              source="updated"
              showTime
              locales="en-GB"
              label="Updated At"
              sortable={false}
            />
            <TextField source="version" sortable={false} />
            <TextField source="publish" label="Shared" sortable={false} />
            <CloneButton icon={<CloneIcon />} />
          </DatagridConfigurable>
        )}
      </List>
    </PageWrapper>
  );
};

export default PackageList;
