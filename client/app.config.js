import 'dotenv/config'

export default {
  expo: {
    // From your app.config.js
    name: "TrackMyChores",
    slug: "track-my-chores",
    // owner: "dojoengineers",
    // owner: "ariella.rollins",
    owner:"berryrue",
    extra: {
      BACKEND_API_URL: process.env.BACKEND_API_URL,
      eas: {
        // projectId: "f9970bf3-a09a-463b-b37d-40622414d40e"
        // projectId: "83482397-4c35-430c-916b-2ac4f6d4263e"
        projectId: "c8a5129c-1222-44d6-a7be-36cbedca12b9"
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
    // added from other app and installed expo-build-properties
    plugins: [
      "expo-notifications",
      ["expo-build-properties",
        {
          android: {
            usesCleartextTraffic: true,
            compileSdkVersion: 35,
            targetSdkVersion: 34,
            //this fixes jfrog dependancy error 1/12/26
            // extraMavenRepos: [
            //   "https://oss.jfrog.org/artifactory/libs-release"
            // ],
            // buildscriptRepositories: [
            //   "https://oss.jfrog.org/artifactory/libs-release"
            // ]
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
      // package: "com.dojoengineers.trackmychores",
      package: "com.berryrue.trackmychores",
      // this lets you register for push!
      googleServicesFile: "./google-services.json",
      // enables FCM V1
      useNextNotificationsApi: true,
      // this stops newer phones from automatically blocking http requests
      // config: {
      //           usesCleartextTraffic: true
      //       },
      // usesCleartextTraffic: true,
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