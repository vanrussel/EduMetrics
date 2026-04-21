/**
 * Pie chart component for proportional data visualization.
 * 
 * Renders a responsive pie chart with data labels and custom styling
 * for the EduMetrics analytics dashboard.
 */

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Register Chart.js components and plugins
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const PieChart = ({ data }) => {
	// Prepare chart data structure
	const chartData = {
		labels: Object.keys(data),
		datasets: [
			{
				data: Object.values(data),
				backgroundColor: ["#6366f1", "#8b5cf6", "#a78bfa"],
				borderWidth: 0,
			},
		],
	};

	// Chart configuration options
	const options = {
		responsive: true,
		maintainAspectRatio: false,
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

	return <Pie data={chartData} options={options} />;
};

export default PieChart;
