/**
 * Gender filter component for analytics dashboard.
 * 
 * Provides a dropdown selection to filter data by gender.
 */
const Filter = ({ value, onChange }) => {
	return (
		<div className="flex items-center gap-3">
			<label className="text-zinc-500 text-xs uppercase tracking-widest">
				Filter by Gender
			</label>
			<select
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="bg-[#111118] text-white text-sm border border-zinc-700 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 cursor-pointer"
			>
				<option value="All">All</option>
				<option value="Male">Male</option>
				<option value="Female">Female</option>
			</select>
		</div>
	);
};

export default Filter;
