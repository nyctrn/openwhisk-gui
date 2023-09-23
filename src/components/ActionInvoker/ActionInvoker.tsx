import {
  useDataProvider,
  useEditContext,
  useNotify,
  Button,
} from "react-admin";
import { styled } from "@mui/system";

import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  LinearProgress,
  TextField,
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

const ActionInvoker = () => {
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

  const [actionName, setActionName] = useState("");

  const [isBlocking, setIsBlocking] = useState(true);

  const [shouldReturnFuncResult, setShouldReturnFuncResult] = useState(false);

  const [showResult, setShowResult] = useState(true);

  const notify = useNotify();

  const [parameters, setParameters] = useState([]);

  const dataProvider = useDataProvider();

  const { mutate, isLoading, data, error } = useMutation(async () => {
    const action = record?.name || actionName;

    const { data } = await dataProvider.invokeAction(action.trim(), {
      blocking: isBlocking,
      result: shouldReturnFuncResult,
      parameters,
    });

    return data;
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === "radio-buttons-blocking")
      setIsBlocking(event.target.value === "true");

    if (event.target.name === "radio-buttons-result")
      setShouldReturnFuncResult(event.target.value === "true");
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setActionName(event.target.value);
  };

  const handleResult = () => {
    setShowResult((prevShow) => !prevShow);
  };

  const handleArrayIputChange = (actionParameters: any) => {
    console.log(actionParameters, "actionParameters handlechange");

    setParameters(actionParameters);
  };

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
        <RadioGroup
          row
          name="radio-buttons-blocking"
          onChange={handleChange}
          value={isBlocking}
        >
          <FormControlLabel value="true" control={<Radio />} label="Blocking" />
          <FormControlLabel
            value="false"
            control={<Radio />}
            label="Non-blocking"
          />
        </RadioGroup>
        <RadioGroup
          row
          name="radio-buttons-result"
          onChange={handleChange}
          value={shouldReturnFuncResult}
        >
          <FormControlLabel
            value="true"
            control={<Radio />}
            label="Action result only"
            disabled={!isBlocking}
          />
          <FormControlLabel
            value="false"
            control={<Radio />}
            label="Entire activation result"
            disabled={!isBlocking}
          />
        </RadioGroup>
      </FormControl>

      <CustomArrayInput onChange={handleArrayIputChange} />

      <Button
        label="invoke action"
        color="secondary"
        onClick={() => mutate()}
        disabled={!isEditMode && !actionName}
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
    </PageWrapper>
  );
};

export default ActionInvoker;
