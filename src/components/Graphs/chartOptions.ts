export const chartOptions: any = {
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: "Time (ms)",
        font: {
          size: 14,
          weight: "bold",
        },
      },
    },
    x: {
      title: {
        display: true,
        text: "Activations",
        font: {
          size: 14,
          weight: "bold",
        },
      },
    },
  },
  plugins: {
    legend: {
      display: true,
      position: "right",
      labels: {
        usePointStyle: true,
        pointStyle: "circle",
        //   generateLabels: function (chart) {
        //     return {
        //       icon: <Warm />,
        //     };
        //   },
      },
    },
    tooltip: {
      callbacks: {
        //   title: (test) => {
        //     return "test title";
        //   },
        //   afterBody: (tooltipItem: any) => {
        //     return `
        //     ActivationId: ${activation.activationId}
        //     Duration: ${activation.duration}
        //     `;
        //   },
        //   afterLabel: (test) => "111testdfs",
        //   label: (test) => "testdfsdddd",
        //   footer: () => "test",
      },
    },
  },
};
