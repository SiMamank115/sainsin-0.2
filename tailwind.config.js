/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./*.{html,js}"],
	theme: {
		extend: {},
	},
	daisyui: {
		themes: ["nord", "dark"],
		darkTheme: "dark",
	},

	plugins: [require("daisyui")],
};
//* npx tailwindcss -i ./tailwind.css -o ./style.css --watch
