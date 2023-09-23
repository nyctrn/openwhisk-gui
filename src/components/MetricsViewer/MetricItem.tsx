import { Doughnut } from "react-chartjs-2";
import { Typography, styled } from "@mui/material";
import { metricsMapping } from "./metricsMapping";

const chartOptions: any = {
  plugins: {
    legend: {
      display: false,
      position: "right",
    },
    tooltip: {
      enabled: false,
    },
  },
};

const MetricWrapper = styled("div")<{ isGauge?: boolean }>`
  width: ${({ isGauge }) => (isGauge ? "250px" : "200px")};
  display: flex;
  flex-direction: column;
  align-items: center;

  h5 {
    position: ${({ isGauge }) => (isGauge ? "absolute" : "unset")};
    top: ${({ isGauge }) => (isGauge ? "1rem" : "unset")};
  }
`;

const MetricItem = ({
  data: externalData,
  gauge,
}: {
  data: any;
  gauge?: boolean;
}) => {
  const chartData = {
    datasets: [
      {
        label: "",
        data: [externalData[1] || 0.1],
        backgroundColor: metricsMapping[externalData[0]].color,
        circumference: gauge ? 180 : 360,
        rotation: gauge ? 270 : 0,
      },
    ],
  };

  const textCenter = {
    id: "textCenter",
    beforeDatasetsDraw(chart: any, args: any, pluginOptions: any) {
      const { ctx } = chart;
      ctx.save();

      ctx.font = "bold 1.6em Roboto";
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.textBaseLine = "middle";

      ctx.fillText(
        `${externalData[1] ?? "-"} ${
          metricsMapping[externalData[0]].unit ?? ""
        }`,
        chart.getDatasetMeta(0).data[0].x + 2,
        chart.getDatasetMeta(0).data[0].y + 4
      );
    },
  };

  return (
    <MetricWrapper isGauge={gauge}>
      <Typography variant="h5">
        {metricsMapping[externalData[0]].name}
      </Typography>
      <Doughnut
        data={chartData}
        options={chartOptions}
        plugins={[textCenter]}
      />
    </MetricWrapper>
  );
};

export default MetricItem;
