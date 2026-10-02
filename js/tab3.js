
document.addEventListener("DOMContentLoaded", function () {
  
  const xValues = ["A", "B", "C", "D, F"];
  const yValues = [52.21, 36.23, 9.22, 2.11];
  const barColors = [
    "#03AED2",
    "#F8DE22",
    "#F45B26",
    "#D12052"
  ];

  const ctx = document.getElementById("colorful-chart");

  const chart = new Chart(ctx, {
    type: "pie",
    plugins: [ChartDataLabels],
    data: {
      labels: xValues,
      datasets: [{
        backgroundColor: barColors,
        data: yValues
      }]
    },
    options: {
      events: [],
      plugins: {
        legend: {
          display: true
        },
        datalabels: {
          color: '#000000',
          anchor: 'end', 
          align: 'end',
          offset: -45,
          font: {
            weight: "bold",
            size: 16,
          },
          formatter: (value) => { return value; }
        }
      }
    }
  });
});
