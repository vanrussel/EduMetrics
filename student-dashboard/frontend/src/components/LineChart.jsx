/**
 * Line chart component for trend visualization.
 * 
 * Renders a responsive line chart with filled area and custom styling
 * for the EduMetrics analytics dashboard.
 */

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

// Register Chart.js components
ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Tooltip,
	Filler,
);

const LineChart = ({ data }) => {
	// Prepare chart data structure
	const chartData = {
		labels: Object.keys(data),
		datasets: [
			{
				data: Object.values(data),
				borderColor: "#6366f1",
				backgroundColor: "rgba(99, 102, 241, 0.1)",
				fill: true,
				tension: 0.4,
				pointRadius: 4,
				pointBackgroundColor: "#6366f1",
				pointBorderColor: "#0a0a0f",
				pointBorderWidth: 2,
			},
		],
	};

	// Chart configuration options
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
