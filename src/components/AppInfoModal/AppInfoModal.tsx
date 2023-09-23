import { CustomDivider, CustomModal } from "../index";
import Typography from "@mui/material/Typography";
import { Info as InfoIcon, GitHub as GitHubIcon } from "@mui/icons-material";
import Link from "next/link";
import { Box, styled } from "@mui/material";
import OpenwhiskLogo from "../../../public/apache-openwhisk.svg";
import Image from "next/image";

const InfoModalContentWrapper = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
`;

const StyledBottomWrapper = styled("div")`
  display: flex;
  width: 60%;
  align-items: center;
  align-self: center;
  gap: 1rem;
  border: 2px solid black;
  padding: 1rem;
  border-radius: 5px;
  box-shadow: 1px 2px 5px 0px rgba(0, 0, 0, 0.75);
  -webkit-box-shadow: 1px 2px 5px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 1px 2px 5px 0px rgba(0, 0, 0, 0.75);
`;

const AppInfoModal = () => {
  const appInfoModalContent = (
    <InfoModalContentWrapper>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h5">OpenWhisk GUI</Typography>

        <Typography>Version: 0.1.0</Typography>
      </Box>

      <Typography variant="body1" display="flex" flexDirection="column">
        <Typography component="span">
          A Web GUI for Apache OpenWhisk serverless platform.
        </Typography>
      </Typography>

      <Box display="flex" alignItems="center" justifyContent="space-evenly">
        <Link
          href="https://openwhisk.apache.org/"
          rel="nooperen noreferrer"
          target="_blank"
        >
          <Image src={OpenwhiskLogo} alt="Apache Openwhisk Logo" width={250} />
        </Link>

        <Link
          href="https://github.com/apache/openwhisk"
          rel="nooperen noreferrer"
          target="_blank"
        >
          <GitHubIcon sx={{ fontSize: "3rem" }} />
        </Link>
      </Box>

      <CustomDivider />

      <StyledBottomWrapper>
        <Link
          href="https://github.com/nyctrn"
          rel="nooperen noreferrer"
          target="_blank"
        >
          <GitHubIcon sx={{ fontSize: "2rem" }} />
        </Link>

        <Typography component="span">marioskourk@gmail.com</Typography>
      </StyledBottomWrapper>
    </InfoModalContentWrapper>
  );

  return (
    <CustomModal
      modalContent={appInfoModalContent}
      buttonIcon={<InfoIcon sx={{ color: "#fff" }} />}
      tooltipTitle="App Info"
    />
  );
};

export default AppInfoModal;
