const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

const WEB_STUBS = {
  'expo-sqlite': './src/services/database.web.ts',
  'expo-image-picker': './src/stubs/expo-image-picker.web.ts',
  'expo-image-manipulator': './src/stubs/expo-image-manipulator.web.ts',
};

// On web, redirect native-only modules to web-compatible stubs
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web') {
    // Full module name match
    if (WEB_STUBS[moduleName]) {
      return {
        filePath: path.resolve(__dirname, WEB_STUBS[moduleName]),
        type: 'sourceFile',
      };
    }
    // Path ending match for database service
    if (moduleName.endsWith('/services/database')) {
      return {
        filePath: path.resolve(__dirname, './src/services/database.web.ts'),
        type: 'sourceFile',
      };
    }
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
