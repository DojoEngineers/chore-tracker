import 'dotenv/config'

export default {
  expo: {
    name: "TrackMyChores",
    slug: "track-my-chores",
    owner: "dojoengineers",
    extra: {
      BACKEND_API_URL: process.env.BACKEND_API_URL,
      eas: {
        projectId: "f9970bf3-a09a-463b-b37d-40622414d40e"
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
    
    plugins: [
      "expo-notifications",
      ["expo-build-properties",
        {
          android: {
            usesCleartextTraffic: true,
            compileSdkVersion: 35,
            targetSdkVersion: 35,
          }
        }
      ]
    ],

    ios: {
      icon: "./assets/ios_icon.png",
      bundleIdentifier: "com.dojoengineers.trackmychores",
      supportsTablet: true,
      userInterfaceStyle: "automatic",
      usesNotifications: true,
      infoPlist: {
        "ITSAppUsesNonExemptEncryption": false
      }
    },

    android: {
      package: "com.dojoengineers.trackmychores",
      // this lets you register for push!
      googleServicesFile: "./google-services.json",
      // enables FCM V1
      useNextNotificationsApi: true,
      userInterfaceStyle: "automatic",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: false, // Changed this for dark mode fix
      softwareKeyboardLayoutMode: "pan",
    },

    web: {
      bundler: "metro",
      favicon: "./assets/favicon.png"
    }
  }
};