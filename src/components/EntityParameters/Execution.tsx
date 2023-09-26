import { TextInput, RadioButtonGroupInput } from "react-admin";
import { Box, Grid, FormControl, GridProps } from "@mui/material";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  FileUploader,
  CodeEditor,
  CustomArrayInput,
  CustomInputLabel,
  ActionKindIcon,
} from "../index";

const Execution = (props: GridProps) => {
  const { setValue, watch, getValues } = useFormContext();

  const [isSequence, setIsSequence] = useState(
    getValues("exec.kind") === "sequence"
  );

  const [isOther, setIsOther] = useState(false);

  const handleKindChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === "sequence") {
      setValue("exec.kind", "sequence");
      setIsSequence(true);
      setIsOther(false);
    } else if (event.target.value === "blackbox") {
      setValue("exec.kind", "blackbox");
      setIsOther(false);
      setIsSequence(false);
    } else if (event.target.value === "other") {
      setValue("exec.kind", "");
      setIsOther(true);
      setIsSequence(false);
    } else {
      setValue("exec.kind", event.target.value);
      setValue("exec.code", "");
      setIsOther(false);
      setIsSequence(false);
    }
  };

  return (
    <>
      <Grid
        item
        {...props}
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <FormControl
          sx={{ flexWrap: "wrap", flexDirection: "column", columnGap: 6 }}
        >
          <Box
            display="flex"
            alignItems="flex-end"
            justifyContent="space-between"
          >
            <RadioButtonGroupInput
              source="exec.kind"
              label="Choose the kind of the action runtime"
              choices={[
                { id: "nodejs:default", name: "NodeJs" },
                { id: "python:default", name: "Python" },
                { id: "blackbox", name: "Docker image" },
                { id: "other", name: "Other" },
                { id: "sequence", name: "Sequence" },
              ]}
              onChange={handleKindChange}
              defaultValue="nodejs:default"
            />

            {!isSequence && (
              <TextInput source="exec.image" label="Docker image" />
            )}

            <Box display="flex" alignItems="baseline" gap={2}>
              {!isOther && (
                <ActionKindIcon
                  execValue={watch("exec.kind")}
                  textAlign="center"
                  width="65px"
                />
              )}

              <TextInput source="exec.kind" label="Kind" required />
            </Box>
          </Box>

          {isSequence && (
            <>
              <TextInput source="exec.components" rows={10} />

              <CustomArrayInput source="parameters" />
            </>
          )}

          {!isSequence && (
            <>
              <FileUploader setValue={setValue} />

              <div style={{ display: "flex", gap: "14px" }}>
                <CodeEditor />
                <CustomArrayInput source="parameters" />
              </div>
            </>
          )}
          <Box>
            <TextInput
              source="exec.main"
              label={
                <CustomInputLabel
                  label="Main"
                  infoIcon={{ info: "The function to call. Defaults to main." }}
                />
              }
              placeholder="main"
              sx={{ width: "120px" }}
              InputLabelProps={{ shrink: true }}
              format={(val) => (!val ? val : undefined)}
            />
          </Box>

          {/* <FileInput source="attachments">
                <CustomFileField />
              </FileInput> */}

          {/* <SelectInput
              source="exec.binary"
              sx={{ flexGrow: 1 }}
              choices={[
                { id: true, name: "true" },
                { id: false, name: "false" },
              ]}
              defaultValue={false}
            /> */}
        </FormControl>
      </Grid>
    </>
  );
};

export default Execution;
