import {
  Box,
  FormControlLabel,
  FormGroup,
  Grid,
  Switch,
  Typography,
  styled,
} from "@mui/material";
import {
  BooleanInput,
  TextInput,
  useRecordContext,
  useResourceContext,
} from "react-admin";
import { CustomDateTimeInput } from "../index";
import { useHasRecord } from "@/utils";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useQueryClient } from "react-query";

const ParamsWrapper = styled(Grid)`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  gap: 5px;
  justify-content: space-evenly;

  input {
    text-align: center;
  }

  .MuiInputBase-root {
    width: 180px;
    box-shadow: 0px 0px 9px 0px rgb(189 189 189 / 37%);
    border: 1px solid #0000001a;

    .Mui-disabled {
      cursor: not-allowed;
    }

    &.MuiInputBase-adornedEnd {
      padding-right: 0;
    }
  }
`;

// FIXME:
const WebAction = () => {
  const { getValues, setValue } = useFormContext();

  const record = useRecordContext();

  const extractedValues: any = {};

  record?.annotations.forEach((annotation: any) => {
    extractedValues[annotation.key] = annotation.value;
  });

  const [action, setAction] = useState({
    "web-export": extractedValues["web-export"] ?? false,
    "raw-http": extractedValues["raw-http"] ?? false,
    final: extractedValues["final"] ?? false,
  });

  useEffect(() => {
    if (!action["web-export"]) {
      setAction({
        ...action,
        "raw-http": false,
        final: false,
      });
    }
  }, [action["web-export"], setValue]);

  const handleChange = (event: any) => {
    const { name, checked } = event.target;

    if (name === "web-export") {
      setAction({
        "web-export": checked,
        "raw-http": false,
        final: checked,
      });

      const annotations = getValues("annotations");

      const updatedAnnotations = annotations.filter(
        (annotation: any) =>
          annotation.key !== "web-export" &&
          annotation.key !== "raw-http" &&
          annotation.key !== "final"
      );

      if (checked) {
        updatedAnnotations.push(
          { key: "web-export", value: true },
          { key: "final", value: true }
        );
      }

      setValue("annotations", updatedAnnotations);
    } else {
      setAction({
        ...action,
        [name]: checked,
      });

      const annotations = getValues("annotations");

      const updatedAnnotations = annotations.filter(
        (annotation: any) => annotation.key !== name
      );

      if (checked) {
        updatedAnnotations.push({ key: name, value: true });
      }

      setValue("annotations", updatedAnnotations);
    }
  };

  return (
    <FormGroup
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        width: "200px",
      }}
    >
      <FormControlLabel
        control={
          <Switch
            onChange={handleChange}
            checked={action["web-export"]}
            name="web-export"
            inputProps={{ "aria-label": "controlled" }}
          />
        }
        label="Web action"
      />

      {action["web-export"] && (
        <Box flexDirection="row">
          <FormControlLabel
            control={
              <Switch
                onChange={handleChange}
                checked={action["final"]}
                name="final"
                size="small"
                inputProps={{ "aria-label": "controlled" }}
              />
            }
            label={
              <Typography component="span" variant="subtitle2">
                Final
              </Typography>
            }
          />

          <FormControlLabel
            control={
              <Switch
                onChange={handleChange}
                checked={action["raw-http"]}
                name="raw-http"
                size="small"
                inputProps={{ "aria-label": "controlled" }}
              />
            }
            label={
              <Typography component="span" variant="subtitle2">
                Raw HTTP
              </Typography>
            }
          />
        </Box>
      )}
    </FormGroup>
  );
};

const RestParams = () => {
  const resource = useResourceContext();

  const queryClient = useQueryClient();

  const isEdit = useHasRecord();

  const data = queryClient.getQueryData<{
    namespace?: "string";
  }>("namespace");

  return (
    <ParamsWrapper item xs={12} sm={12} md={12}>
      <TextInput source="name" required />

      <TextInput
        source="namespace"
        defaultValue={data?.namespace ?? "_ "}
        disabled
      />

      {resource === "rules" && (
        <>
          <TextInput
            source={isEdit ? "trigger.name" : "trigger"}
            label="Trigger"
          />

          <TextInput
            source={isEdit ? "action.name" : "action"}
            label="Action"
          />

          {isEdit && <TextInput source="status" disabled />}
        </>
      )}

      <TextInput
        source="version"
        placeholder="0.0.1"
        InputLabelProps={{ shrink: true }}
      />

      <CustomDateTimeInput />

      {resource === "packages" && (
        <BooleanInput source="publish" sx={{ alignSelf: "center" }} />
      )}

      {resource === "actions" && <WebAction />}
    </ParamsWrapper>
  );
};

export default RestParams;
