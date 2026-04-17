import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// imports the Tailwind plugin for Vite

export default defineConfig({
	plugins: [react(), tailwindcss()],
	// Vercel looks for the 'dist' folder by default
	build: {
		outDir: "dist",
	},
});
