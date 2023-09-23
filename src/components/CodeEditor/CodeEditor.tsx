import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-github_dark";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/ext-language_tools";
import { useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";

const initialJavascriptValue = `function main(args) {
    const hello = args.name || "world"
    return { hello };
  }
  `;

const initialPythonValue = `def main(args):
  name = args.get('name', 'world')
  return {'hello': name}
`;

const CodeEditor = () => {
  const { getValues, setValue, watch } = useFormContext();

  const [editorMode, setEditorMode] = useState("javascript");

  useEffect(() => {
    const kind = getValues("exec.kind");

    if (kind?.includes("nodejs")) setEditorMode("javascript");
    if (kind?.includes("python")) setEditorMode("python");
  }, [getValues("exec.kind")]);

  useEffect(() => {
    const code = getValues("exec.code");

    const kind = getValues("exec.kind");

    if (!code && kind?.includes("nodejs")) {
      setValue("exec.code", initialJavascriptValue);
    } else if (!code && kind?.includes("python")) {
      setValue("exec.code", initialPythonValue);
    } else {
      setValue("exec.code", code);
    }
  }, [getValues("exec.code"), getValues("exec.kind")]);

  const handleChange = (value: any) => {
    setValue("exec.code", value);
  };

  const handleOnLoad = () => {
    setValue("exec.code", initialJavascriptValue);
  };

  return (
    <AceEditor
      mode={editorMode}
      theme="github_dark"
      width="100%"
      onLoad={handleOnLoad}
      onChange={handleChange}
      fontSize={16}
      showPrintMargin={true}
      showGutter={true}
      highlightActiveLine={true}
      value={watch("exec.code")}
      setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: false,
        showLineNumbers: true,
        tabSize: 2,
        useWorker: false,
      }}
      style={{
        flex: 4,
        marginBottom: "14px",
        boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.75)",
        borderRadius: "13px",
      }}
    />
  );
};

export default CodeEditor;
