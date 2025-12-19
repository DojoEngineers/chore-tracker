import 'dotenv/config'

export default {
  expo: {
    // From your app.config.js
    name: "TrackMyChores",
    slug: "track-my-chores",
    // owner: "dojoengineers",
    owner: "ariella.rollins",
    extra: {
      BACKEND_API_URL: "http://192.168.1.217:8000",
      eas: {
        // projectId: "f9970bf3-a09a-463b-b37d-40622414d40e"
        projectId: "83482397-4c35-430c-916b-2ac4f6d4263e"
      }
    },

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
      icon: "./assets/ios_icon.svg",
      bundleIdentifier: "com.dojoengineers.trackmychores",
      supportsTablet: true,
      userInterfaceStyle: "automatic"
    },
    
    android: {
      package: "com.ariella.trackmychores",
      googleServicesFile: "./google-services.json",
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