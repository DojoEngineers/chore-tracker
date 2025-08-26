import 'dotenv/config'

export default {
  expo: {
    // From your app.config.js
    name: "ChoreTracker",
    slug: "chore-tracker", 
    extra: {
      BACKEND_API_URL: process.env.BACKEND_API_URL,
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
      userInterfaceStyle: "automatic",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: false, // Changed this for dark mode fix
      androidStatusBar: {
        barStyle: "dark-content",
        backgroundColor: "#F5F8F6"
      }
    },
    
    web: {
      bundler: "metro",
      favicon: "./assets/favicon.png"
    }
  }
};