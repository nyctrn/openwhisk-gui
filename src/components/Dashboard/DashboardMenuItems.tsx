import { styled } from "@mui/material";
import DashboardMenuItem from "./DashboardItemMenuItem";
import {
  CampaignSharp as InvokerIcon,
  BarChartSharp as GraphsIcon,
  SchemaSharp as FlowsIcon,
} from "@mui/icons-material";

const DashboardMenuItemsWrapper = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 30%;
`;

const dashboardMenuItems = [
  { name: "Invoker", path: "/invoker", icon: <InvokerIcon /> },
  { name: "Activations Graphs", path: "/graphs", icon: <GraphsIcon /> },
  {
    name: (
      <>
        Create Flows <br></br> (experimental)
      </>
    ),
    path: "/flows",
    icon: <FlowsIcon />,
  },
];

const DashboardMenu = () => (
  <DashboardMenuItemsWrapper>
    {dashboardMenuItems.map((item) => (
      <DashboardMenuItem key={item.path} {...item} />
    ))}
  </DashboardMenuItemsWrapper>
);

export default DashboardMenu;
