/**
 * Analytics API client for EduMetrics frontend.
 * 
 * This module provides functions to interact with the backend analytics API
 * endpoints for fetching student performance data and visualizations.
 */

import axios from "axios";

// Base API URL from environment variables
const BASE_URL = import.meta.env.VITE_API_URL;

/**
 * Build query string from parameters object.
 * Filters out null/undefined values and "All" selections.
 * 
 * @param {Object} params - Query parameters
 * @returns {string} Formatted query string
 */
const buildQuery = (params = {}) => {
	const query = Object.entries(params)
		.filter(([, v]) => v && v !== "All")
		.map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
		.join("&");
	return query ? `?${query}` : "";
};

/**
 * Send GET request to analytics API endpoint.
 * 
 * @param {string} path - API endpoint path
 * @param {Object} params - Query parameters
 * @returns {Promise} API response data
 */
const get = async (path, params) => {
	const response = await axios.get(
		`${BASE_URL}/analytics${path}${buildQuery(params)}`,
	);
	return response.data;
};

// API endpoint functions for analytics data

/**
 * Fetch key performance indicators.
 * @param {string} gender - Optional gender filter
 * @returns {Promise} KPI data
 */
export const getKPIs = (gender) => get("/kpis", { gender });

/**
 * Fetch score distribution data.
 * @param {string} gender - Optional gender filter
 * @returns {Promise} Score distribution data
 */
export const getScoreDistribution = (gender) =>
	get("/score-distribution", { gender });

/**
 * Fetch exam scores by school type.
 * @param {string} gender - Optional gender filter
 * @returns {Promise} School type analytics data
 */
export const getExamScoreBySchoolType = (gender) =>
	get("/exam-score-by-school-type", { gender });

/**
 * Fetch exam scores by internet access.
 * @param {string} gender - Optional gender filter
 * @returns {Promise} Internet access analytics data
 */
export const getExamScoreByInternetAccess = (gender) =>
	get("/exam-score-by-internet-access", { gender });

/**
 * Fetch exam scores by teacher quality.
 * @param {string} gender - Optional gender filter
 * @returns {Promise} Teacher quality analytics data
 */
export const getExamScoreByTeacherQuality = (gender) =>
	get("/exam-score-by-teacher-quality", { gender });

/**
 * Fetch gender distribution data.
 * @param {string} gender - Optional gender filter
 * @returns {Promise} Gender distribution data
 */
export const getGenderDistribution = (gender) =>
	get("/gender-distribution", { gender });

/**
 * Fetch school type distribution data.
 * @param {string} gender - Optional gender filter
 * @returns {Promise} School type distribution data
 */
export const getSchoolTypeDistribution = (gender) =>
	get("/school-type-distribution", { gender });

/**
 * Fetch internet access distribution data.
 * @param {string} gender - Optional gender filter
 * @returns {Promise} Internet access distribution data
 */
export const getInternetAccessDistribution = (gender) =>
	get("/internet-access-distribution", { gender });
