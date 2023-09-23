import { Alert, Tooltip } from "@mui/material";
import { CircularProgress } from "@mui/material";
import { useDataProvider, useNotify, usePermissions } from "react-admin";
import { styled } from "@mui/system";
import { useQuery } from "react-query";
import { useEffect } from "react";

const Wrapper = styled("div")`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-right: 5%;
`;

const StyledSpan = styled("span")`
  background-color: #223b5a;
  padding: 8px;
  border-radius: 6px;
  font-weight: 600;
  cursor: default;
`;

const NamespaceDisplay = () => {
  const dataProvider = useDataProvider();

  const { permissions, isLoading: isLoadingPermissions } = usePermissions();

  const { data: { namespace } = "", isFetching: isFetchingNamespace } =
    useQuery(
      "namespace",
      async () => await dataProvider.fetchCurrentNamespace(),
      {
        staleTime: Infinity,
        enabled: !!permissions,
      }
    );

  return (
    <Wrapper>
      {isLoadingPermissions ||
        (isFetchingNamespace && (
          <CircularProgress size={16} sx={{ color: "#fff", ml: "10px" }} />
        ))}

      <span>Namespace:</span>

      <Tooltip title="Current namespace">
        <StyledSpan> {namespace ?? "-"}</StyledSpan>
      </Tooltip>
    </Wrapper>
  );
};

export default NamespaceDisplay;
