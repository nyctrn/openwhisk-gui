import {
  Show,
  useLoading,
  SimpleShowLayout,
  useShowContext,
  TextField,
  FunctionField,
} from "react-admin";
import {
  BackButton,
  CustomDivider,
  OverlayLoader,
  PageWrapper,
} from "@/components";
import { Typography } from "@mui/material";
import { PropsWithChildren } from "react";

const CustomLabel = (props: PropsWithChildren) => (
  <Typography color="#325c80" variant="h6">
    {props.children}
  </Typography>
);

const activationFields = [
  { source: "activationId", label: "ID" },
  { source: "name", label: "Name" },
  { source: "containerStart", label: "Start type" },
  { source: "startDateTime", label: "Start Date" },
  { source: "start", label: "Start time timestamp" },
  { source: "end", label: "End time timestamp" },
  { source: "duration", label: "Duration (ms)" },
  { source: "publish", label: "Publish" },
  { source: "version", label: "Version" },
];

const activationResponseFields = [
  { source: "response.result", label: "Result" },
  { source: "response.size", label: "Size" },
  { source: "response.status", label: "Status" },
  { source: "response.success", label: "Success" },
];

const AnnotationsResponseResult = () => {
  const { record } = useShowContext();

  const limtsObject = record.annotations.find(
    (annotation: { key: string; value: any }) => annotation.key === "limits"
  )?.value;

  return (
    <>
      <CustomLabel>Annotations</CustomLabel>
      {record.annotations.map((item: any, i: number) => {
        if (item.key !== "limits") {
          return (
            <FunctionField
              key={i}
              render={(record: any) => {
                return (
                  <Typography variant="h6">
                    {record.annotations[i].key}:{" "}
                    {`${record.annotations[i].value}`}
                  </Typography>
                );
              }}
              fontSize={20}
            />
          );
        }
      })}

      {Object.entries(limtsObject ?? {}).map((limit: any, i: number) => {
        return (
          <FunctionField
            key={limit[0]}
            render={(record: any) => {
              return (
                <Typography variant="h6">
                  {limit[0]}: {`${limit[1]}`}
                </Typography>
              );
            }}
            fontSize={20}
          />
        );
      })}
    </>
  );
};

const ActivationLogs = () => {
  const { record } = useShowContext();

  return (
    <>
      <CustomLabel>Logs</CustomLabel>
      {record.logs.map((logItem: any, i: number) => {
        const splitLog = logItem.split(" ");

        let log: any;

        log = `${new Date(splitLog[0])} : ${splitLog[1]}`;

        if (log.includes("Invalid Date")) {
          log = logItem;
        }

        return (
          <FunctionField
            key={i}
            render={(any) => <Typography variant="h6">{log}</Typography>}
            fontSize={20}
          />
        );
      })}
    </>
  );
};

const ActivationShow = () => {
  const isLoading = useLoading();

  return (
    <PageWrapper>
      <Show
        sx={{
          width: "88%",
          alignSelf: "center",
          alignContent: "center",
          position: "relative",
        }}
      >
        <BackButton sx={{ padding: "1rem", alignSelf: "flex-start" }} />

        <Typography textAlign="center" variant="h4">
          Activation information
        </Typography>

        <SimpleShowLayout
          sx={{ padding: "3rem", width: "80%", position: "relative" }}
          spacing={2}
          divider={<CustomDivider />}
        >
          {activationFields.map((fieldItem) => {
            if (fieldItem.source === "startDateTime") {
              return (
                <>
                  <CustomLabel>{fieldItem.label}</CustomLabel>
                  <FunctionField
                    key={fieldItem.source}
                    label={<CustomLabel>{fieldItem.label}</CustomLabel>}
                    render={(record: any) => {
                      return <span>{`${new Date(record.start)}`}</span>;
                    }}
                    fontSize={20}
                  />
                </>
              );
            }

            return (
              <TextField
                key={fieldItem.source}
                source={fieldItem.source}
                label={<CustomLabel>{fieldItem.label}</CustomLabel>}
                fontSize={20}
              />
            );
          })}

          {activationResponseFields.map((fieldItem: any) => {
            if (fieldItem.source === "response.result") {
              return (
                <FunctionField
                  key={fieldItem.souce}
                  label={<CustomLabel>{fieldItem.label}</CustomLabel>}
                  render={(record: any) => (
                    <Typography variant="h6">
                      {JSON.stringify(record.response.result)}
                    </Typography>
                  )}
                  fontSize={20}
                />
              );
            }

            return (
              <TextField
                key={fieldItem.source}
                source={fieldItem.source}
                label={<CustomLabel>{fieldItem.label}</CustomLabel>}
                fontSize={20}
              />
            );
          })}

          <AnnotationsResponseResult />

          <ActivationLogs />
        </SimpleShowLayout>
        <OverlayLoader
          open={isLoading}
          sx={{
            position: "absolute",
            borderRadius: "4px",
            span: { marginBottom: "40%" },
          }}
        />
      </Show>
    </PageWrapper>
  );
};

export default ActivationShow;
