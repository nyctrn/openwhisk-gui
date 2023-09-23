import { ArrayInput, SimpleFormIterator, TextInput } from "react-admin";
import { styled } from "@mui/system";

const CustomArrayInput = ({ source }: { source: string }) => {
  // FIXME:
  const StyledTextInput = styled(TextInput)`
    /* margin-bottom: 0; */
  `;

  return (
    <ArrayInput sx={{ flexWrap: "wrap" }} source={source}>
      <SimpleFormIterator>
        <StyledTextInput source="key" helperText="" sx={{ marginBottom: 0 }} />
        <StyledTextInput source="value" helperText="" sx={{ marginTop: 0 }} />
      </SimpleFormIterator>
    </ArrayInput>
  );
};

export default CustomArrayInput;
