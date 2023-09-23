import { Input, styled } from "@mui/material";
import { useRef } from "react";

const StyledInputWrapper = styled("div")`
  display: flex;
  gap: 6px;

  input {
    font-size: 13px;
    width: 85px;
    height: 24px;
    padding-bottom: 0;
  }

  .MuiInput-root::before {
    content: none;
  }
`;

const FileUploader = ({ setValue }: { setValue: any }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = () => {
    const file = fileInputRef && fileInputRef.current?.files[0];

    const fileNameSplit = file.name.split(".");

    const fileExt = fileNameSplit[fileNameSplit.length - 1];

    const reader = new FileReader();

    reader.addEventListener("load", () => {
      const jsCode = reader.result;
      setValue("exec.code", jsCode);
    });

    if (file) reader.readAsText(file);

    switch (file?.type || fileExt) {
      case "text/javascript":
      case "js":
        setValue("exec.kind", "nodejs:default");
        break;

      case "text/x-python":
      case "py":
        setValue("exec.kind", "python:default");
        break;

      default:
        setValue("exec.kind", "");
        break;
    }
  };

  return (
    <StyledInputWrapper>
      <span>Write the action in the editor or upload a source file: </span>
      <Input type="file" inputRef={fileInputRef} onChange={handleFileChange} />
    </StyledInputWrapper>
  );
};

export default FileUploader;
