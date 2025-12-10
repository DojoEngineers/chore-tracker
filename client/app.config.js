import 'dotenv/config'

export default {
  expo: {
    // From your app.config.js
    name: "TrackMyChores",
    slug: "track-my-chores",
    owner: "dojoengineers",
    extra: {
      BACKEND_API_URL: process.env.BACKEND_API_URL,
      eas: {
        projectId: "f9970bf3-a09a-463b-b37d-40622414d40e"
      }
    },

    // From your app.json
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
  
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    
    splash: {
      image: "./assets/icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    
    ios: {
      bundleIdentifier: "com.dojoengineers.trackmychores",
      supportsTablet: true,
      userInterfaceStyle: "automatic"
    },
    
    android: {
      package: "com.dojoengineers.trackmychores",
      userInterfaceStyle: "automatic",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: false, // Changed this for dark mode fix
      softwareKeyboardLayoutMode: "pan"
    },
    
    web: {
      bundler: "metro",
      favicon: "./assets/favicon.png"
    }
  }
};