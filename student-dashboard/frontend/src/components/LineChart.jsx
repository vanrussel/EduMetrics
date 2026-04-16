import { Line } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Tooltip,
	Filler,
} from "chart.js";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Tooltip,
	Filler,
);
// Filler — enables the fill area under the line

const LineChart = ({ data }) => {
	const chartData = {
		labels: Object.keys(data),
		datasets: [
			{
				data: Object.values(data),
				borderColor: "#6366f1",
				backgroundColor: "rgba(99, 102, 241, 0.1)",
				fill: true,
				// fill: true — fills the area under the line with backgroundColor
				tension: 0.4,
				pointRadius: 4,
				pointBackgroundColor: "#6366f1",
				pointBorderColor: "#0a0a0f",
				// pointBorderColor — ring around each dot matches the background
				pointBorderWidth: 2,
			},
		],
	};

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: { display: false },
		},
		scales: {
			x: {
				grid: { display: false },
				ticks: { color: "#71717a", font: { size: 11 } },
			},
			y: {
				grid: { color: "#1f1f2e" },
				ticks: { color: "#71717a", font: { size: 11 } },
			},
		},
	};

	return <Line data={chartData} options={options} />;
};

export default LineChart;
