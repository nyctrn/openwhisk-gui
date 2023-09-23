import { CircularProgress, Tooltip } from "@mui/material";
import {
  List,
  TextField,
  DateField,
  useLoading,
  DatagridConfigurable,
  FunctionField,
} from "react-admin";
import { ActionKindIcon, ListActions, PageWrapper } from "@/components";
import Image from "next/image";
import ColdStart from "../../../public/cold-start.svg";
import WarmStart from "../../../public/warm-start.svg";

const ActivationList = () => {
  const isLoading = useLoading();
  // const isSmall = useMediaQuery((theme: any) => theme.breakpoints.down("sm"));
  return (
    <PageWrapper>
      <List actions={<ListActions />} empty={false}>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <DatagridConfigurable
            rowClick="show"
            isRowSelectable={() => false}
            bulkActionButtons={false}
          >
            <TextField source="index" label="" sortable={false} />
            <TextField
              source="activationId"
              label="Activation ID"
              sortable={false}
            />
            <TextField source="name" label="Activation name" sortable={false} />
            <DateField
              source="start"
              label="Activation start time"
              locales="en-GB"
              showTime
              sortable={false}
            />
            <TextField
              source="response.status"
              label="Response status"
              sortable={false}
            />
            <TextField
              source="duration"
              sortable={false}
              label="Duration (ms)"
            />
            <TextField
              source="waitTime"
              label="Wait time (ms)"
              sortable={false}
            />

            <FunctionField
              key={1}
              render={(record: any) => (
                <ActionKindIcon execValue={record.kind} />
              )}
              label="Kind"
              sortable={false}
            />

            <TextField source="path" label="Path" sortable={false} />
            <TextField
              source="initTime"
              label="Init time (ms)"
              sortable={false}
            />
            <TextField source="entity" label="Entity" sortable={false} />
            <FunctionField
              key={1}
              render={(record: any) => {
                if (record.entity === "trigger") return "-";

                return (
                  <Tooltip
                    title={
                      record.containerStart === "warm"
                        ? "Warm start"
                        : "Cold start"
                    }
                  >
                    <Image
                      src={
                        record.containerStart === "warm" ? WarmStart : ColdStart
                      }
                      alt="Container start icon"
                      width={30}
                      loading="eager"
                    />
                  </Tooltip>
                );
              }}
              label="Start type"
              sortable={false}
            />
          </DatagridConfigurable>
        )}
      </List>
    </PageWrapper>
  );
};

export default ActivationList;
