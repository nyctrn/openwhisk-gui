import { Button, ButtonProps, useResourceContext } from "react-admin";
import BackIcon from "@mui/icons-material/ArrowBackIos";
import { Box } from "@mui/material";

const BackButton = (props: ButtonProps) => {
  const resource = useResourceContext();

  return (
    <Box>
      <Button href={`/#/${resource}`} label="Back" {...props}>
        <BackIcon />
      </Button>
    </Box>
  );
};

export default BackButton;
