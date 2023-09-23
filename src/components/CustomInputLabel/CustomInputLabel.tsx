import { Box } from "@mui/material";
import { InfoIconTooltip } from "../index";
import { InfoIconTooltipType } from "../InfoIconTooltip/InfoIconTooltip";

type CustomInputLabelType = {
  label: string;
  infoIcon?: InfoIconTooltipType;
};

const CustomInputLabel = ({ label, infoIcon }: CustomInputLabelType) => (
  <Box
    sx={{
      display: "flex",
      gap: 1,
    }}
  >
    <span>{label}</span>

    {infoIcon && <InfoIconTooltip {...infoIcon} />}
  </Box>
);

export default CustomInputLabel;
