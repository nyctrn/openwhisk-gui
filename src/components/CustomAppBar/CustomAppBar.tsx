import { AppBar, AppBarProps } from "react-admin";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import {
  CustomUserMenu,
  NamespaceDisplay,
  AppInfoModal,
  CustomRefreshIconButton,
  ActivationPoll,
} from "../index";
import { styled } from "@mui/system";
import OpenwhiskLogo from "../../../public/apache-openwhisk-logo.svg";

const LogoWrapper = styled("div")`
  display: flex;
  align-items: center;

  :hover {
    cursor: pointer;
  }
`;

const CustomAppBar = (props: AppBarProps) => {
  const navigate = useNavigate();

  return (
    <AppBar
      {...props}
      sx={{ backgroundColor: "#26446a" }}
      userMenu={<CustomUserMenu />}
    >
      <LogoWrapper onClick={() => navigate("/")}>
        <Image src={OpenwhiskLogo} alt="Apache Openwhisk Logo" width={45} />
        <Typography variant="h5" margin={2} marginLeft={1}>
          {props.title}
        </Typography>
      </LogoWrapper>
      <Box flex={2} />
      <NamespaceDisplay />
      <ActivationPoll />
      <AppInfoModal />
      <CustomRefreshIconButton />
    </AppBar>
  );
};

export default CustomAppBar;
