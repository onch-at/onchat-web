import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'OnChat',
  bundledWebRuntime: false,
  webDir: 'www',
  server: {
    url: 'https://chat.hypergo.net'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;