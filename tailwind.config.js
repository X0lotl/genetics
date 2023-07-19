/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["sans-serif"],
			},
			container: {
				center: true,
			},
			colors: {
				"dark-blue": "#101e39",
				"light-blue": "#67758f",
				gray: "#6d6e70",
			},
		},
	},
	plugins: [],
};
