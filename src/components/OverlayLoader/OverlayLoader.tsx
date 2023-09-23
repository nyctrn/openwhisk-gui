import { Backdrop, CircularProgress, BackdropProps } from "@mui/material";

const OverlayLoader = ({ open, ...restProps }: BackdropProps) => {
  return open ? (
    <Backdrop {...restProps} open={open}>
      <CircularProgress size={50} />
    </Backdrop>
  ) : null;
};

export default OverlayLoader;
