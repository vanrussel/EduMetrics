import { useEffect, useState } from "react";
import {
	getKPIs,
	getScoreDistribution,
	getSchoolTypeDistribution,
	getInternetAccessDistribution,
	getExamScoreByTeacherQuality,
} from "./api/analytics";
import KPICards from "./components/KPICards.jsx";
import BarChart from "./components/BarChart.jsx";
import LineChart from "./components/LineChart.jsx";
import DoughnutChart from "./components/DoughnutChart.jsx";
import PieChart from "./components/PieChart.jsx";
import Filter from "./components/Filter.jsx";

// helper — returns total student count label
const studentCountLabel = (total) =>
	total != null ? `${total.toLocaleString()} students` : "";

// helper — forces categorical data into a logical Low -> Medium -> High order
const sortCategories = (dataObj) => {
	if (!dataObj) return {};
	const order = ["Low", "Medium", "High"];
	const sorted = {};

	order.forEach((key) => {
		if (dataObj[key] !== undefined) {
			sorted[key] = dataObj[key];
		}
	});

	Object.keys(dataObj).forEach((key) => {
		if (!order.includes(key)) {
			sorted[key] = dataObj[key];
		}
	});

	return sorted;
};

const App = () => {
	const [gender, setGender] = useState("All");
	const [data, setData] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchAll = async () => {
			setLoading(true);
			setError(null);
			try {
				const [kpis, dist, school, internet, teacher] = await Promise.all([
					getKPIs(gender),
					getScoreDistribution(gender),
					getSchoolTypeDistribution(gender),
					getInternetAccessDistribution(gender),
					getExamScoreByTeacherQuality(gender),
				]);

				setData({
					kpis,
					dist,
					school,
					internet,
					teacher: sortCategories(teacher),
				});
			} catch (e) {
				setError(`Failed to load data: ${e.message}`);
			} finally {
				setLoading(false);
			}
		};
		fetchAll();
	}, [gender]);

	if (error)
		return (
			<div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
				<p className="text-red-400 text-sm">{error}</p>
			</div>
		);

	return (
		<div className="min-h-screen bg-[#0a0a0f] p-4 md:p-6 lg:p-8 font-sans">
			{/* header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
				<div>
					<p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">
						Analytics Dashboard
					</p>
					<h1 className="text-white text-2xl md:text-3xl font-semibold">
						Student Performance
					</h1>
				</div>
				<Filter value={gender} onChange={setGender} />
			</div>

			{loading ? (
				<div className="flex items-center justify-center py-32">
					<p className="text-zinc-500 text-sm tracking-widest uppercase">
						Loading...
					</p>
				</div>
			) : (
				<div className="flex flex-col gap-4">
					{/* KPIs row */}
					<KPICards data={data.kpis} />

					{/* 4-COLUMN BENTO GRID */}
					<div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
						{/* ================= ROW 1 ================= */}

						{/* Main Distribution Chart (Line Chart) -> 3 Columns */}
						<div className="lg:col-span-3 bg-[#111118] rounded-3xl border border-zinc-800 p-6 flex flex-col hover:border-zinc-700 transition-colors">
							<div className="flex justify-between items-end mb-4">
								<div>
									<p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1">
										Distribution
									</p>
									<h2 className="text-zinc-100 text-sm font-medium">
										Score Distribution Curve
									</h2>
								</div>
								<p className="text-zinc-500 text-xs hidden sm:block">
									{studentCountLabel(data.kpis.total_students)}
								</p>
							</div>
							<div className="flex-1 w-full relative min-h-62.5 h-full">
								<LineChart data={data.dist} />
							</div>
						</div>

						{/* School Type Doughnut -> 1 Column */}
						<div className="lg:col-span-1 bg-[#111118] rounded-3xl border border-zinc-800 p-6 flex flex-col hover:border-zinc-700 transition-colors">
							<div className="w-full mb-4">
								<p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1">
									Demographics
								</p>
								<h2 className="text-zinc-100 text-sm font-medium">
									School Type
								</h2>
							</div>
							<div className="flex-1 w-full relative min-h-50">
								<DoughnutChart data={data.school} />
							</div>
						</div>

						{/* ================= ROW 2 ================= */}

						{/* Internet Access Pie -> 1 Column */}
						<div className="lg:col-span-1 bg-[#111118] rounded-3xl border border-zinc-800 p-6 flex flex-col hover:border-zinc-700 transition-colors">
							<div className="w-full mb-4">
								<p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1">
									Connectivity
								</p>
								<h2 className="text-zinc-100 text-sm font-medium">
									Internet Access
								</h2>
							</div>
							<div className="flex-1 w-full relative min-h-50">
								<PieChart data={data.internet} />
							</div>
						</div>

						{/* Teacher Quality Bar -> 2 Columns (Swapped into the middle) */}
						<div className="lg:col-span-2 bg-[#111118] rounded-3xl border border-zinc-800 p-6 flex flex-col hover:border-zinc-700 transition-colors">
							<div className="flex justify-between items-end mb-4">
								<div>
									<p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1">
										Instruction
									</p>
									<h2 className="text-zinc-100 text-sm font-medium">
										Avg Score by Teacher Quality
									</h2>
								</div>
								<p className="text-zinc-500 text-xs hidden sm:block">
									{studentCountLabel(data.kpis.total_students)}
								</p>
							</div>
							<div className="flex-1 w-full relative min-h-50 h-full">
								<BarChart data={data.teacher} horizontal />
							</div>
						</div>

						{/* Stacked Top Range & Summary -> 1 Column (Swapped to the right) */}
						<div className="lg:col-span-1 flex flex-col gap-4">
							{/* Top Range */}
							<div className="flex-1 bg-[#111118] rounded-3xl border border-zinc-800 p-5 flex flex-col justify-center hover:border-zinc-700 transition-colors">
								<div>
									<p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1">
										Performance
									</p>
									<h2 className="text-zinc-100 text-sm font-medium">
										Top Bracket
									</h2>
								</div>
								<div className="mt-2">
									<p className="text-4xl font-bold text-white tracking-tighter">
										{
											Object.entries(data.dist).sort(
												(a, b) => b[1] - a[1],
											)[0][0]
										}
									</p>
									<p className="text-zinc-500 text-xs mt-1">
										{
											Object.entries(data.dist).sort(
												(a, b) => b[1] - a[1],
											)[0][1]
										}{" "}
										students
									</p>
								</div>
							</div>

							{/* Summary */}
							<div className="flex-1 bg-[#111118] rounded-3xl border border-zinc-800 p-5 flex flex-col justify-center hover:border-zinc-700 transition-colors">
								<div>
									<p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1">
										Overview
									</p>
									<h2 className="text-zinc-100 text-sm font-medium">Summary</h2>
								</div>
								<div className="grid grid-cols-2 gap-2 mt-2">
									<div>
										<p className="text-zinc-500 text-[10px] uppercase">
											Avg Score
										</p>
										<p className="text-white text-lg font-semibold">
											{data.kpis.avg_exam_score}
										</p>
									</div>
									<div>
										<p className="text-zinc-500 text-[10px] uppercase">
											Records
										</p>
										<p className="text-white text-lg font-semibold">
											{data.kpis.total_students}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default App;
