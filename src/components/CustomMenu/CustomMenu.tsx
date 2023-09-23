// in src/MyMenu.js
import { Menu } from "react-admin";
import { Collapse, List, ListItemButton, ListItem } from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  CampaignSharp as InvokerIcon,
  BarChartSharp as GraphsIcon,
  SchemaSharp as FlowsIcon,
} from "@mui/icons-material";
import { useState } from "react";
// #16283e
const menuItemStyles = {
  //   ml: 3,
  "&&.MuiMenuItem-root": {
    borderLeft: 0,
    fontSize: "0.98rem",
    "&.RaMenuItemLink-active": {
      paddingLeft: "17px",
    },
  },
  ".expanded-db-icon": { fontSize: "1.3rem" },
  // "&&.MuiSvgIcon-root": { fontSize: "1rem" },
  "&&.MuiButtonBase-root": { width: "100%", paddingLeft: "17px" },
};

const CustomMenu = () => {
  const [open, setOpen] = useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <Menu>
      <List
        sx={{
          ".MuiListItem-root": { padding: 0 },
          ".MuiListItemButton-root": { padding: 0 },
          pb: 0,
        }}
      >
        <ListItemButton>
          <ListItem
            sx={{
              backgroundColor: "#26446a",
              position: "relative",
            }}
          >
            <Menu.DashboardItem
              onDoubleClick={handleClick}
              sx={{ width: "100%" }}
            />
            {open ? (
              <ExpandLess
                onClick={handleClick}
                sx={{ position: "absolute", left: "150px" }}
              />
            ) : (
              <ExpandMore
                onClick={handleClick}
                sx={{ position: "absolute", left: "150px" }}
              />
            )}
          </ListItem>
        </ListItemButton>
        <Collapse
          in={open}
          timeout="auto"
          unmountOnExit
          sx={{ backgroundColor: "#0e2e57" }}
        >
          <List component="div" disablePadding>
            <ListItemButton>
              <Menu.Item
                sx={menuItemStyles}
                to="/invoker"
                primaryText="Invoker"
                leftIcon={<InvokerIcon className="expanded-db-icon" />}
              />
            </ListItemButton>

            <ListItemButton>
              <Menu.Item
                sx={menuItemStyles}
                to="/graphs"
                primaryText="Activations Graphs"
                leftIcon={<GraphsIcon className="expanded-db-icon" />}
              />
            </ListItemButton>
            <ListItemButton>
              <Menu.Item
                sx={menuItemStyles}
                to="/flows"
                primaryText="Create Flows"
                leftIcon={<FlowsIcon className="expanded-db-icon" />}
              />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
      <Menu.ResourceItem name="actions" />
      <Menu.ResourceItem name="triggers" />
      <Menu.ResourceItem name="rules" />
      <Menu.ResourceItem name="packages" />
      <Menu.ResourceItem name="activations" />
    </Menu>
  );
};

export default CustomMenu;
