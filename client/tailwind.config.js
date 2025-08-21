/** @type {import('tailwindcss').Config} */
module.exports = {

  // Add this line - crucial for Android compatibility
  darkMode: 'media',
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./views/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        lightBg: "#F5F8F6",
        lightPrimaryText: "#262626",
        lightSecondaryText: "#737780",
        lightLink: "#FB943C",
        lightButton: "#84A99D",
        darkBg: "#22252B",
        grayBg: "#333740",
        darkPrimaryText: "#FFFFFF",
        darkSecondaryText: "#A1A4AA",
        darkLink: "#BAFF56",
        darkButton: "#FB943C",
      },
      fontFamily: {
        nunito: ['Nunito_400Regular'],
        nunitoBold: ['Nunito_700Bold'],
      },
    },
  },
  plugins: [],
}

