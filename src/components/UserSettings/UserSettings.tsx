import { PageWrapper } from "../index";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import NamespaceControl from "./NamespacesControl";
import LimitsControl from "./LimitsControl";

const SectionsWrapper = styled("div")`
  display: flex;
  flex-direction: column;
  margin: 15px;
  gap: 1.5rem;
`;

const SectionWrapper = styled("div")`
  display: flex;
  flex-direction: column;
  align-content: space-between;
  margin-left: 20px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #26446abf;
  background-color: #aeaeae1a;

  > div {
    justify-content: center;
    margin: 20px 0px 0px 20px;
  }
`;

const UserSettings = () => (
  <PageWrapper>
    <Box display="flex" alignItems="center" gap={1} marginBottom={3}>
      <SettingsIcon />
      <Typography variant="h5">Settings</Typography>
    </Box>
    <SectionsWrapper>
      <SectionWrapper>
        <Typography variant="h6">Namespace control</Typography>
        <NamespaceControl />
      </SectionWrapper>

      <SectionWrapper>
        <Typography variant="h6">Limits control</Typography>
        <LimitsControl />
      </SectionWrapper>
    </SectionsWrapper>
  </PageWrapper>
);

export default UserSettings;
