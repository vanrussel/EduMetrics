/**
 * Bar chart component for data visualization.
 * 
 * Renders a responsive bar chart with custom styling for the
 * EduMetrics analytics dashboard.
 */

import { Bar } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Tooltip,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const BarChart = ({ data }) => {
	// Prepare chart data structure
	const chartData = {
		labels: Object.keys(data),
		datasets: [
			{
				data: Object.values(data),
				backgroundColor: "#6366f1",
				hoverBackgroundColor: "#818cf8",
				borderRadius: 6,
				borderSkipped: false,
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
				min: Math.min(...Object.values(data)) - 5,
				max: Math.max(...Object.values(data)) + 5,
			},
		},
	};

	return <Bar data={chartData} options={options} />;
};

export default BarChart;
