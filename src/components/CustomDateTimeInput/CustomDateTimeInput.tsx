import { TextField, InputAdornment, Tooltip } from "@mui/material";
import { useState } from "react";
import { useEditContext } from "react-admin";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";

const CustomInputAdornment = ({
  showUnixTime,
  onClick,
}: {
  showUnixTime: boolean;
  onClick: () => void;
}) => (
  <InputAdornment position="start">
    <Tooltip title={`Change to ${showUnixTime ? "Date" : "Unix Time"}`}>
      <ChangeCircleIcon onClick={onClick} style={{ cursor: "pointer" }} />
    </Tooltip>
  </InputAdornment>
);

const CustomDateTimeInput = () => {
  const { record } = useEditContext();

  const isEditMode = !!record;

  const [showUnixTime, setShowUnixTime] = useState(false);

  const handleClick = () => setShowUnixTime((prevTime) => !prevTime);

  const convertUnixTimeStampToDateString = (unixTime: string) => {
    const dateObj = new Date(unixTime);
    const formattedDate = `${dateObj.getUTCDate()}/${
      dateObj.getUTCMonth() + 1
    }/${dateObj.getUTCFullYear()}, ${dateObj.getUTCHours()}:${dateObj.getUTCMinutes()}`;

    return formattedDate;
  };

  if (!isEditMode) return null;

  return (
    <TextField
      value={
        showUnixTime
          ? convertUnixTimeStampToDateString(record?.updated)
          : record?.updated
      }
      label="Updated At"
      disabled
      InputProps={{
        endAdornment: (
          <CustomInputAdornment
            onClick={handleClick}
            showUnixTime={showUnixTime}
          />
        ),
      }}
    />
  );
};

export default CustomDateTimeInput;
