import {
  useDataProvider,
  useEditContext,
  useNotify,
  Button,
} from "react-admin";
import { styled } from "@mui/system";

import {
  FormControl,
  LinearProgress,
  TextField,
  // Button,
} from "@mui/material";
import { useMutation } from "react-query";
import { useState, useEffect, ChangeEvent } from "react";
import { PageWrapper } from "../index";

interface CustomArrayInputProps {
  onChange: (value: any) => void;
}

const CustomArrayInput: React.FC<CustomArrayInputProps> = ({ onChange }) => {
  const [values, setValues] = useState<any[]>([]);

  const handleAddFields = () => {
    setValues([...values, { key: "", value: "" }]);
  };

  const handleRemoveField = (index: number) => {
    const updatedValues = values.filter((_, i) => i !== index);
    setValues(updatedValues);
    onChange(updatedValues);
  };

  const handleChange = (index: number, value: string, name: string) => {
    const updatedValues = [...values];

    updatedValues[index] = {
      ...updatedValues[index],
      [name]: value,
    };

    setValues(updatedValues);

    onChange(updatedValues);
  };

  return (
    <div>
      {values.map((value, index) => (
        <div key={index}>
          <TextField
            name="key"
            type="text"
            value={value["key"]}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleChange(index, e.target.value, e.target.name)
            }
          />
          <TextField
            name="value"
            type="text"
            value={value["value"]}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleChange(index, e.target.value, e.target.name)
            }
          />
          <Button
            type="button"
            onClick={() => handleRemoveField(index)}
            label="Remove"
          />
        </div>
      ))}
      <Button type="button" onClick={handleAddFields} label="Add arguments" />
    </div>
  );
};

const TriggerInvoker = () => {
  const StyledCodeSnippet = styled("pre")`
    background: #f4f4f4;
    border: 1px solid #ddd;
    border-left: 3px solid #1976d2;
    color: #666;
    page-break-inside: avoid;
    font-family: monospace;
    font-size: 14px;
    line-height: 1.5;
    margin-bottom: 1.6em;
    max-width: 100%;
    overflow: auto;
    padding: 1em 1.5em;
    display: block;
    word-wrap: break-word;
  `;

  const { record } = useEditContext();

  const isEditMode = !!record;
  const [triggerName, setTriggerName] = useState("");
  const [activationId, setActivationId] = useState("");
  const [showResult, setShowResult] = useState(true);
  const notify = useNotify();
  const [parameters, setParameters] = useState([]);

  const dataProvider = useDataProvider();

  const { mutate, isLoading, data, error } = useMutation(async () => {
    const trigger = record?.name || triggerName;

    const { data } = await dataProvider.invokeTrigger(trigger.trim(), {
      parameters,
    });

    setActivationId(data.activationId);

    return data;
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTriggerName(event.target.value);
  };

  const handleResult = () => {
    setShowResult((prevShow) => !prevShow);
  };

  const handleArrayIputChange = (actionParameters: any) => {
    setParameters(actionParameters);
  };

  //   const handleClick = async () => {
  //     const test = await dataProvider.invokeAction(record.name, {
  //       blocking: true,
  //     });
  //   };

  useEffect(() => {
    if (error) notify(error.message, { type: "error" });
  }, [error, notify]);

  return (
    <PageWrapper>
      <FormControl>
        {!isEditMode && (
          <TextField
            label="enter action name..."
            onChange={handleInputChange}
          />
        )}
      </FormControl>

      <CustomArrayInput onChange={handleArrayIputChange} />

      <Button
        label="fire trigger"
        color="secondary"
        onClick={() => mutate()}
        disabled={!isEditMode && !triggerName}
      />

      {error && (
        <>
          <span>{(error as { message: string }).message}</span>
          <br />
          <span>Message: {error.response?.data?.message}</span>
          <br />
          <span>Error: {error.response?.data?.error?.error}</span>
          <br />
          <span>Code: {error.response?.data?.error?.code}</span>
        </>
      )}

      {/* {isLoading ? (
            <span>loading....</span>
          ) : isBlocking ? (
            <div></div>
          ) : (
            <div>ActivationId: {activationId}</div>
          )} */}

      {/* {isBlocking && activationId && !isLoading ? (
            <div></div>
          ) : (
            activationId && !isLoading && <div>ActivationId: {activationId}</div>
          )} */}
      {isLoading ? (
        <LinearProgress />
      ) : (
        data && (
          <>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <span onClick={handleResult} style={{ cursor: "pointer" }}>
                {showResult ? "Hide" : "Show"} action result
              </span>
            </div>

            {showResult && (
              <>
                <StyledCodeSnippet>
                  {JSON.stringify(data, null, "\t")}
                </StyledCodeSnippet>
              </>
            )}
          </>
        )
      )}
      {/* {shouldReturnFuncResult ? } */}
    </PageWrapper>
  );
};

export default TriggerInvoker;
