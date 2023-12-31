import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		AutoImport({
			dts: "src/auto-import.d.ts",
			imports: [
				"vue",
				{
					"vue-toastification": ["useToast"],
				},
			],
			dirs: ["src/components", "src/sections"],
		}),
		Components({
			extensions: ["vue"],
			include: [/\.vue$/, /\.vue\?vue/],
			dts: "src/components.d.ts",
		}),
	],
});
