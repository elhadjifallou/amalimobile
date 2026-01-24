import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.amali.love',
  appName: 'Amali',
  webDir: 'dist',
  
  // ✅ Configuration serveur (CRUCIAL pour iOS)
  server: {
    androidScheme: 'https',
    iosScheme: 'capacitor',
    hostname: 'localhost',
    cleartext: true
  },
  
  // ✅ Configuration iOS
  ios: {
    contentInset: 'always',
    scheme: 'Amali'
  },
  
  // ✅ Configuration Android
  android: {
    allowMixedContent: true,
    captureInput: true
  },
  
  // ✅ Plugins configuration
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#ffffff',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#ffffff'
    }
  }
};

export default config;