import * as React from "react";
import { useCallback, ReactElement } from "react";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import NavigationRefresh from "@mui/icons-material/Refresh";
import { useTranslate } from "ra-core";
import { useQueryClient } from "react-query";
import { useLoading } from "ra-core";
import { CircularProgress, styled } from "@mui/material";

const defaultIcon = <NavigationRefresh sx={{ fontSize: "1.7rem" }} />;

type CustomRefreshIconButtonProps = {
  className?: string;
  icon?: ReactElement;
  label?: string;
  onClick?: (e: MouseEvent) => void;
};

const CustomRefreshIconButtonWrapper = styled("div")`
  display: flex;
  justify-content: center;
  width: 40px;
  margin-right: 0.6rem;
`;

const CustomRefreshIconButton = (props: CustomRefreshIconButtonProps) => {
  const {
    label = "ra.action.refresh",
    icon = defaultIcon,
    onClick,
    className,
    ...rest
  } = props;
  const loading = useLoading();
  const queryClient = useQueryClient();
  const translate = useTranslate();

  const handleClick = useCallback(
    (event: any) => {
      event.preventDefault();

      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey !== "namespace",
      });

      if (typeof onClick === "function") {
        onClick(event);
      }
    },
    [queryClient, onClick]
  );

  return (
    <CustomRefreshIconButtonWrapper>
      {loading ? (
        <CircularProgress
          size={21}
          sx={{
            color: "#fff",
          }}
        />
      ) : (
        <Tooltip title={label && translate(label, { _: "Refresh" })}>
          <IconButton
            aria-label={label && translate(label, { _: "Refresh" })}
            className={className}
            color="inherit"
            onClick={handleClick}
            {...rest}
          >
            {icon}
          </IconButton>
        </Tooltip>
      )}
    </CustomRefreshIconButtonWrapper>
  );
};

export default CustomRefreshIconButton;
