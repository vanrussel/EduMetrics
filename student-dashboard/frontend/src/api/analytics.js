import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

// builds query string from params object, skipping null/undefined values
const buildQuery = (params = {}) => {
	const query = Object.entries(params)
		.filter(([, v]) => v && v !== "All")
		.map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
		.join("&");
	return query ? `?${query}` : "";
};

const get = async (path, params) => {
	// sends a GET request to the backend with optional query params
	const response = await axios.get(
		`${BASE_URL}/analytics${path}${buildQuery(params)}`,
	);
	return response.data;
};

export const getKPIs = (gender) => get("/kpis", { gender });
export const getScoreDistribution = (gender) =>
	get("/score-distribution", { gender });
export const getExamScoreBySchoolType = (gender) =>
	get("/exam-score-by-school-type", { gender });
export const getExamScoreByInternetAccess = (gender) =>
	get("/exam-score-by-internet-access", { gender });
export const getExamScoreByTeacherQuality = (gender) =>
	get("/exam-score-by-teacher-quality", { gender });
export const getGenderDistribution = (gender) =>
	get("/gender-distribution", { gender });
export const getSchoolTypeDistribution = (gender) =>
	get("/school-type-distribution", { gender });
export const getInternetAccessDistribution = (gender) =>
	get("/internet-access-distribution", { gender });
