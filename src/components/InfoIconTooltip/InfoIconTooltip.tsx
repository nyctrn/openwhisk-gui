import { ReactNode } from "react";
import { Tooltip, Box } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

export type InfoIconTooltipType = {
  info?: string;
  defaultValue?: string;
  icon?: ReactNode;
};

const InfoIconTooltip = ({ info, defaultValue, icon }: InfoIconTooltipType) => (
  <Tooltip
    placement="top"
    title={
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontSize: "1.1em" }}>{info}</span>
        {defaultValue && (
          <span style={{ fontSize: "1.1em", fontWeight: "bold" }}>
            Default value: {defaultValue}
          </span>
        )}
      </Box>
    }
  >
    <Box>{icon ? icon : <InfoIcon />}</Box>
  </Tooltip>
);

export default InfoIconTooltip;
