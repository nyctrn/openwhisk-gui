import { DashboardComponent } from "react-admin";
import { styled } from "@mui/system";
import { PageWrapper, MetricsViewer } from "../";
import DashboardMenu from "./DashboardMenuItems";

const DashboardWrapper = styled("div")`
  display: flex;
  gap: 20px;
  padding: 50px;
`;

const Dashboard: DashboardComponent = () => {
  return (
    <PageWrapper>
      <DashboardWrapper>
        <MetricsViewer />
        <DashboardMenu />
      </DashboardWrapper>
    </PageWrapper>
  );
};

export default Dashboard;
