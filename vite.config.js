// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
	base: "./",
	build: {
		/* minify: true, */
		/* outDir: ".", */
		lib: {
			// Could also be a dictionary or array of multiple entry points
			entry: resolve(__dirname, "src/index.js"),
			formats: ["es"],
			name: "4000-network",
			// the proper extensions will be added
			fileName: "network-4000",
		},
		rollupOptions: {
			/* out input file to bundle the js & css */
			input: {
				main: resolve(__dirname, "index.html"),
			},
		},
	},
});
