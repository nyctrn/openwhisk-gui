import { Box, BoxProps } from "@mui/material";

const PageWrapper = (props: BoxProps) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      padding: "40px 20px 40px",
    }}
    {...props}
  >
    {props.children}
  </Box>
);

export default PageWrapper;
