import { TextInput, ArrayInput, SimpleFormIterator } from "react-admin";

const CustomArrayInput = ({ source }: { source: string }) => {
  const stringToBoolean = (inputValue: string) => {
    if (inputValue.toLowerCase() === "true") return true;
    if (inputValue.toLowerCase() === "false") return false;
    return inputValue;
  };

  return (
    <ArrayInput source={source} sx={{ flex: 1 }}>
      <SimpleFormIterator disableReordering inline>
        <TextInput
          source="key"
          helperText=""
          resettable
          parse={stringToBoolean}
        />
        <TextInput
          source="value"
          helperText=""
          resettable
          parse={stringToBoolean}
        />
      </SimpleFormIterator>
    </ArrayInput>
  );
};

export default CustomArrayInput;
