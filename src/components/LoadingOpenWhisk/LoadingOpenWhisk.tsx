import { Box, CircularProgress, Typography } from "@mui/material";
import Image from "next/image";
import OpenwhiskLogo from "../../../public/apache-openwhisk-logo.svg";

const LoadingOpenWhisk = () => (
  <Box
    display="flex"
    flexDirection="column"
    alignSelf="center"
    alignItems="center"
    justifyContent="flex-start"
    marginTop="15%"
    gap={12}
    height={"100vh"}
  >
    <CircularProgress size={40} />
    <Image src={OpenwhiskLogo} alt="Apache Openwhisk Logo" width={100} />
    <Typography variant="h4">Loading...</Typography>
  </Box>
);

export default LoadingOpenWhisk;
