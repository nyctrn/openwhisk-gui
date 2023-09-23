import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { useGetList, useGetOne } from "react-admin";
import { PageWrapper } from "../index";
import { Dict, Activation } from "openwhisk";
import { Box } from "@mui/material";
import { chartOptions } from "./chartOptions";
import GraphFilter from "./GraphFilter";

const Graphs = () => {
  const [isActivationId, setIsActivationId] = useState<boolean>();

  const [limit, setLimit] = useState(10);

  const [since, setSince] = useState<number>();

  const [upto, setUpto] = useState<number>();

  const [name, setName] = useState<string>();

  const [activationId, setActivationId] = useState<string>();

  const { data: activationsData, refetch: refetchActivations } = useGetList(
    "activations",
    {
      filter: { limit, since, upto, name, fullDesc: true },
    },
    { enabled: false, keepPreviousData: true }
  );

  const { data: activationData, refetch: refetchActivation } = useGetOne(
    "activations",
    {
      id: activationId,
    },
    { enabled: false }
  );

  const activData = isActivationId ? [activationData] : activationsData;

  const executionTimes = activData?.map(
    (activation: Activation<Dict>) => activation?.duration
  );

  const activationInitTime = activData?.map(
    (activation) => activation?.initTime
  );

  const activationWaitTime = activData?.map(
    (activation) =>
      activation?.annotations.find(
        (annotation: Dict) => annotation.key === "waitTime"
      )?.value ?? 0
  );

  const labels = activData?.map((activation, index) => activation?.name);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Duration",
        data: executionTimes,
        backgroundColor: "rgba(48, 75, 151, 0.452)",
      },
      {
        label: "Init time",
        data: activationInitTime,
        backgroundColor: "rgba(240, 141, 49, 0.719)",
      },
      {
        label: "Wait time",
        data: activationWaitTime,
        backgroundColor: "rgba(58, 228, 240, 0.719)",
      },
    ],
  };

  return (
    <PageWrapper>
      <Box display="flex" flexDirection="column" gap={4}>
        <GraphFilter
          limit={limit}
          setLimit={setLimit}
          since={since}
          setSince={setSince}
          upto={upto}
          setUpto={setUpto}
          name={name}
          setName={setName}
          activationId={activationId}
          setActivationId={setActivationId}
          refetchActivations={refetchActivations}
          refetchActivation={refetchActivation}
          setIsActivationId={setIsActivationId}
        />
        <Bar data={chartData} options={chartOptions} />
      </Box>
    </PageWrapper>
  );
};

export default Graphs;
