import { useQuery } from "react-query";
import { useDataProvider, usePermissions } from "react-admin";
import { Paper, Typography, styled } from "@mui/material";
import MetricItem from "./MetricItem";
import { OverlayLoader } from "../index";
import { useQueryClient } from "react-query";

const MetricsHeader = styled("div")`
  background-color: #325c80;
  color: #fff;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
`;

const MetricsWrapper = styled(Paper)`
  position: relative;
  width: 70%;
  min-width: 1100px;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
`;

const MetricItemsWrapper = styled("div")`
  display: flex;
  position: relative;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1rem;
`;

const ActivationTimeMetrics = styled("div")`
  background-color: aliceblue;
`;

const MetricsViewer = () => {
  const queryClient = useQueryClient();

  const {
    permissions,
    isLoading: isLoadingPermissions,
    error,
  } = usePermissions();

  const data = queryClient.getQueryData<{
    namespace?: "string";
  }>("namespace");

  const dataProvider = useDataProvider();

  const { data: entitiesCount, isFetching: isFetchingEntitiesCount } =
    useQuery<any>(
      "entitiesCount",
      async () => await dataProvider.fetchEntitiesCount(),
      { enabled: !!permissions && !!data?.namespace }
    );

  const { data: activationsMetrics, isFetching: isFetchingActivationMetrics } =
    useQuery<any>(
      "activationsMetrics",
      async () => await dataProvider.fetchActivationsMetrics(),
      { enabled: !!permissions && !!data?.namespace }
    );

  return (
    <MetricsWrapper>
      <MetricsHeader>
        <Typography ml={2} variant="h4">
          Overview
        </Typography>
      </MetricsHeader>
      <MetricItemsWrapper>
        {Object?.entries(entitiesCount ?? {}).map((entity) => (
          <MetricItem key={entity[0]} data={entity} />
        ))}
      </MetricItemsWrapper>

      <MetricItemsWrapper>
        {Object?.entries(activationsMetrics ?? {})
          .filter((metric) => metric[0] !== "activationsTimeMetrics")
          .map((metric) => (
            <MetricItem key={metric[0]} data={metric} />
          ))}
      </MetricItemsWrapper>
      <ActivationTimeMetrics>
        <MetricItemsWrapper>
          {Object?.entries(
            activationsMetrics?.["activationsTimeMetrics"] ?? {}
          ).map((metric) => (
            <MetricItem key={metric[0]} data={metric} gauge />
          ))}
        </MetricItemsWrapper>
      </ActivationTimeMetrics>
      <OverlayLoader
        open={
          isLoadingPermissions ||
          isFetchingActivationMetrics ||
          isFetchingEntitiesCount
        }
        sx={{
          position: "absolute",
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
        }}
      />
    </MetricsWrapper>
  );
};

export default MetricsViewer;
