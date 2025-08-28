// import 'dotenv/config'
// import { AndroidConfig } from '@expo/config-plugins';
require('dotenv/config');
const { AndroidConfig } = require('@expo/config-plugins');

module.exports = {
  expo: {
    // From your app.config.js
    name: "ChoreTracker",
    slug: "chore-tracker",
    runtimeVersion: "1.0.0", // Add this
    updates: {
      url: "https://u.expo.dev/6d7a9599-3889-436c-b230-9f8afa020ed1" // EAS will tell you the exact URL
    },
    extra: {
      BACKEND_API_URL: process.env.BACKEND_API_URL || "http://192.168.1.29:8000",
      eas: {
        projectId: "6d7a9599-3889-436c-b230-9f8afa020ed1"
      }
    },

    // From your app.json
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",

    userInterfaceStyle: "automatic",
    newArchEnabled: true,

    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },

    ios: {
      supportsTablet: true,
      userInterfaceStyle: "automatic"
    },

    android: {
      permissions: [
        "android.permission.INTERNET",
        "android.permission.VIBRATE",
        "android.permission.RECEIVE_BOOT_COMPLETED",
        "android.permission.WAKE_LOCK"
      ],
      userInterfaceStyle: "automatic",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: false, // Changed this for dark mode fix
      androidStatusBar: {
        barStyle: "dark-content",
        backgroundColor: "#F5F8F6"
      },
      package: "com.ariella.choretracker" // Add this line
    },

    web: {
      bundler: "metro",
      favicon: "./assets/favicon.png"
    }
  }
};