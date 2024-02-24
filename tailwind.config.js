/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				green: {
					100: '#FBFADA',
					200: '#ADBC9F',
					300: '#436850',
					400: '#12372A',
				},
			},
			plugins: [],
		},
	},
};
