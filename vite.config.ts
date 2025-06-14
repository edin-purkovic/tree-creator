import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import svgr from "vite-plugin-svgr"
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
	base: '/pages/dist/',
	plugins: [
		react(),
		svgr(),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	build:{
		sourcemap: false
	}
})
