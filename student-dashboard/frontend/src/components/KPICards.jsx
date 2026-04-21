/**
 * Key Performance Indicator cards component.
 * 
 * Displays important metrics in a responsive grid layout with
 * labels, values, and descriptive subtitles.
 */
const KPICards = ({ data }) => {
	// Define KPI card configurations
	const cards = [
		{ label: "Total Students", value: data.total_students, sub: "enrolled" },
		{ label: "Avg Exam Score", value: data.avg_exam_score, sub: "current avg" },
		{
			label: "Avg Previous Score",
			value: data.avg_previous_scores,
			sub: "historical baseline",
		},
		{
			label: "Avg Hours Studied",
			value: data.avg_hours_studied,
			sub: "per week",
		},
		{
			label: "Avg Attendance",
			value: `${data.avg_attendance}%`,
			sub: "attendance rate",
		},
		{ label: "Avg Sleep Hours", value: data.avg_sleep_hours, sub: "per night" },
	];

	return (
		// Responsive grid layout for KPI cards
		<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
			{cards.map((card) => (
				<div
					key={card.label}
					className="bg-[#111118] rounded-2xl border border-zinc-800 p-4 hover:border-zinc-700 transition-colors"
				>
					<p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-3 whitespace-nowrap overflow-hidden text-ellipsis">
						{card.label}
					</p>
					<p className="text-white text-2xl font-bold">{card.value}</p>
					<p className="text-zinc-600 text-xs mt-1">{card.sub}</p>
				</div>
			))}
		</div>
	);
};

export default KPICards;
