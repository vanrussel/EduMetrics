import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const DoughnutChart = ({ data }) => {
	const chartData = {
		labels: Object.keys(data),
		datasets: [
			{
				data: Object.values(data),
				backgroundColor: ["#6366f1", "#a78bfa"],
				borderWidth: 0,
				// hoverOffset — how much a slice pops out on hover
				hoverOffset: 6,
			},
		],
	};

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		cutout: "65%",
		// cutout — size of the hole in the middle (65% = thin ring)
		plugins: {
			legend: {
				position: "bottom",
				labels: { color: "#71717a", font: { size: 11 }, padding: 16 },
			},
			datalabels: {
				color: "#fff",
				font: { weight: "bold", size: 12 },
				formatter: (value) => value,
			},
		},
	};

	return <Doughnut data={chartData} options={options} />;
};

export default DoughnutChart;
