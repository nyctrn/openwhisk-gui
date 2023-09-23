import React, { useState, ReactNode } from "react";
import { Button, Modal, Tooltip, Box } from "@mui/material";
import { styled } from "@mui/system";

const StyledBox = styled(Box)`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  background-color: ${({ theme }) => theme.palette.background.paper};
  box-shadow: 0px 11px 15px -7px rgba(0, 0, 0, 0.2),
    0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12);
  padding: ${({ theme }) => theme.spacing(4)};

  button {
    align-self: flex-end;
  }
`;

type CustomModalProps = {
  modalContent: ReactNode;
  buttonIcon?: ReactNode;
  buttonText?: ReactNode;
  tooltipTitle?: string;
};

const CustomModal = ({
  modalContent,
  buttonIcon,
  buttonText,
  tooltipTitle,
}: CustomModalProps) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const ButtonContentWrapper = styled("div")`
    display: flex;
    gap: 5px;
    text-transform: none;
  `;

  return (
    <>
      <Tooltip title={tooltipTitle}>
        <Button
          onClick={handleOpen}
          sx={{ justifyContent: "center", width: "50px" }}
        >
          <ButtonContentWrapper>
            {buttonIcon} {buttonText}
          </ButtonContentWrapper>
        </Button>
      </Tooltip>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <StyledBox>
          <div>{modalContent}</div>
          <Button color="info" variant="contained" onClick={handleClose}>
            ok
          </Button>
        </StyledBox>
      </Modal>
    </>
  );
};

export default CustomModal;
