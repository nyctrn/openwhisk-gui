import React, { useState } from "react";
import {
  Button,
  Modal,
  Tooltip,
  Box,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import { styled } from "@mui/system";
import Typography from "@mui/material/Typography";
import { useQuery, useQueryClient } from "react-query";
import { axiosClient } from "@/api/axiosClient";
import { PendingActionsSharp as ActivationPollingIcon } from "@mui/icons-material";
import Draggable from "react-draggable";
import { Lock } from "@mui/icons-material";

const ToolbarElementsWrapper = styled(Box)`
  display: flex;
  align-items: center;
  gap: 10px;

  svg {
    cursor: pointer;
  }

  button {
    padding: 0;
    justify-content: flex-start;
  }
`;

const ContentWrapper = styled(Box)<{ windowDraggable: boolean }>`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  height: 300px;
  background-color: ${({ theme }) => theme.palette.background.paper};
  box-shadow: 0px 11px 15px -7px rgba(0, 0, 0, 0.2),
    0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12);
  padding: 5px 20px 25px 20px;

  button {
    align-self: flex-end;
  }

  justify-content: space-between;

  ${({ windowDraggable }) =>
    !windowDraggable &&
    `
      overflow: hidden;
      resize: both;
    `}
`;

const StyledModal = styled(Modal)`
  width: 500px;
  margin: 0 auto;

  .MuiBackdrop-root {
    display: none;
  }
`;

const ActivationPoll = () => {
  const [isWindowOpen, setIsWindowOpen] = useState(false);

  const [timestamp, setTimestamp] = useState<number>();

  const [polling, setPolling] = useState(false);

  const [opacity, setOpacity] = useState(1);

  const [disableDrag, SetDisableDrag] = useState(false);

  const handleActivationPollingIconClick = () => setIsWindowOpen(!isWindowOpen);

  const handleCloseWindow = () => setIsWindowOpen(false);

  const queryClient = useQueryClient();

  const handleClick = () => {
    setPolling(!polling);

    setTimestamp(Date.now());
  };

  const handleLogFlush = () => {
    queryClient.removeQueries({ queryKey: "activationPolling" });

    setTimestamp(Date.now());
  };

  const { data } = useQuery({
    queryKey: ["activationsPolling"],
    queryFn: () =>
      axiosClient.get(
        `activations?docs=true&limit=0&since=${timestamp}&skip=0`
      ),
    refetchInterval: 2000,
    enabled: polling,
  });

  // FIXME:
  const pollingData = data?.data?.data;

  const ActivationPollingContent = ({
    disableDrag,
    handleDraggable,
    opacity,
  }: {
    disableDrag: boolean;
    handleDraggable: (disableDrag: boolean) => void;
    opacity: number;
  }) => (
    <Box sx={{ paddingLeft: "10px", paddingRight: "10px" }}>
      <FormGroup sx={{ flexDirection: "row" }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={!disableDrag}
              onClick={() => handleDraggable(!disableDrag)}
              size="small"
            />
          }
          label={<Typography variant="subtitle2">Draggable</Typography>}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={opacity < 1}
              onClick={() => setOpacity(opacity < 1 ? 1 : 0.3)}
              size="small"
            />
          }
          label={<Typography variant="subtitle2">Transparency</Typography>}
        />
      </FormGroup>

      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        marginBottom={2}
      >
        <Typography variant="h5">Activation polling logs</Typography>
        <Button onClick={handleLogFlush}>Flush logs</Button>
      </Box>

      {!polling && <span>Activation polling is disabled.</span>}

      {polling && !pollingData?.length ? (
        <span>Activation Polling has started...</span>
      ) : (
        pollingData?.map?.((activation: any) => {
          return (
            <ul key={activation.activationId}>
              <li>{activation.logs[0]}</li>
            </ul>
          );
        })
      )}
    </Box>
  );

  const ButtonContentWrapper = styled("div")`
    display: flex;
    gap: 5px;
    text-transform: none;
  `;

  const ResizePoint = styled("div")<{ windowDraggable: boolean }>`
    position: absolute;
    width: 30px;
    height: 30px;
    right: 0px;
    bottom: 0px;
    cursor: pointer;
  `;

  const ExpandIcon = ({ windowDraggable }: { windowDraggable: boolean }) => {
    return (
      <div style={{ position: "relative", width: "25px", height: "25px" }}>
        <Lock
          style={{
            position: "absolute",
            right: "0px",
            bottom: "0px",
            color: "red",
            transform: "none",
            fontSize: "10px",
            display: windowDraggable ? "inline-block" : "none",
          }}
        />
      </div>
    );
  };

  return (
    <>
      <ToolbarElementsWrapper>
        <ButtonContentWrapper>
          <Tooltip title="Open Activation polling window">
            <ActivationPollingIcon
              onClick={handleActivationPollingIconClick}
              sx={{ fontSize: "1.6rem" }}
            />
          </Tooltip>
        </ButtonContentWrapper>
        <span>Polling is </span>
        <Tooltip
          title={`Activation Polling is ${polling ? "enabled" : "disabled"}`}
        >
          <Button onClick={handleClick} sx={{ width: "50px" }} disableRipple>
            {polling ? (
              <span style={{ color: "#23e623d6", fontWeight: "bold" }}>on</span>
            ) : (
              <span style={{ color: "#a7beffeb", fontWeight: "bold" }}>
                off
              </span>
            )}
          </Button>
        </Tooltip>
      </ToolbarElementsWrapper>
      <Draggable axis="both" disabled={disableDrag}>
        <StyledModal
          open={isWindowOpen}
          onClose={handleCloseWindow}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={{ bgcolor: "none", opacity }}
          disableAutoFocus
        >
          <ContentWrapper windowDraggable={!disableDrag}>
            <ActivationPollingContent
              disableDrag={disableDrag}
              handleDraggable={SetDisableDrag}
              opacity={opacity}
            />
            <Button
              color="info"
              variant="contained"
              onClick={handleCloseWindow}
            >
              close
            </Button>
            <Tooltip title="Window size locked" enterDelay={300}>
              <ResizePoint
                onDoubleClick={() => SetDisableDrag(!disableDrag)}
                windowDraggable={!disableDrag}
              >
                <ExpandIcon windowDraggable={!disableDrag} />
              </ResizePoint>
            </Tooltip>
          </ContentWrapper>
        </StyledModal>
      </Draggable>
    </>
  );
};

export default ActivationPoll;
