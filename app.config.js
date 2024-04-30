function getAppVersion(appVersion) {
  const iosDistribution = appVersion;

  const versionArray = appVersion.split('.');
  const androidDistribution =
    parseInt(versionArray[0], 10) * 1000000 + parseInt(versionArray[1], 10) * 1000 + parseInt(versionArray[2], 10);

  return {
    iosDistribution,
    androidDistribution,
  };
}

// change this version to change the in app version
const APP_VERSION = '0.0.1';
const ENVIRONMENT = process.env.ENVIRONMENT ?? 'prod';

const version = getAppVersion(APP_VERSION);

const notProduction = ENVIRONMENT !== '' && ENVIRONMENT !== 'prod' && ENVIRONMENT !== 'production';

const package_name = `com.indywork.expocamera${notProduction ? `.${ENVIRONMENT}` : ''}`;

const BASE_DOMAIN = process.env.BASE_DOMAIN;

export default {
  name: 'Expo Camera',
  slug: 'expo-camera-rotated-videos',
  scheme: `expocamera${notProduction ? `-${ENVIRONMENT}` : ''}`,
  runtimeVersion: {
    policy: 'sdkVersion',
  },
  version: `${APP_VERSION}`,
  androidStatusBar: {
    backgroundColor: '#EC008C',
  },
  android: {
    package: package_name,
    versionCode: version.androidDistribution,
  },
  ios: {
    buildNumber: `${version.iosDistribution}`,
    infoPlist: {
      NSCameraUsageDescription:
        'In order to take a profile picture, Pole Position requires camera access. We will never share your images outside of the app.',
      NSLocationWhenInUseUsageDescription:
        'Pole Position uses your location to search for clubs nearby.  Your location will never be shared.',
      NSPhotoLibraryUsageDescription:
        'In order to select a profile picture, Pole Position requires access to your photo library.  We will never share your images outside of the app.',
      NSFaceIDUsageDescription:
        'This app uses facial or fingerprint recognition to allow easier login. Your biometric data is never shared outside the app.',
      NSLocationUsageDescription:
        'Pole Position uses your location to search for clubs nearby.  Your location will never be shared.',
    },
    userInterfaceStyle: 'automatic',
    bundleIdentifier: `com.bigtrizzystudios.expocamera${notProduction ? `.${ENVIRONMENT}` : ''}`,
    entitlements: {
      'com.apple.developer.applesignin': ['Default'],
    },
  },
  orientation: 'portrait',
  splash: {
    backgroundColor: '#EC008C',
    image: `./themes/pole_position/assets/splash_2022${notProduction ? `_${ENVIRONMENT}` : ''}.png`,
    resizeMode: 'cover',
  },
  platforms: ['ios', 'android'],
  owner: 'poleposition',
  plugins: [
    [
      'expo-camera',
      {
        cameraPermission: 'Allow Expo Camera  to access your camera.',
        microphonePermission: 'Allow Expo Camera to access your microphone.',
      },
    ],
    'expo-font',
  ],
  extra: {
    eas: {
      projectId: 'c4720305-5842-42af-80ce-6a876a50cf7b',
    },
  },
};
