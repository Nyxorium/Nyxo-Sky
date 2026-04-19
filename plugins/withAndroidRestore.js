const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

module.exports = function withAndroidRestore(config) {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      // Early escape unless explicitly enabled
      if (process.env.ENABLE_ANDROID_RESTORE !== 'true') {
        return config;
      }

      const backupRootEnv = process.env.ANDROID_RESTORE_PATH;

      // Skip if no path provided
      if (!backupRootEnv) {
        console.log('Skipping Android restore: no ANDROID_RESTORE_PATH set');
        return config;
      }

      const projectRoot = config.modRequest.projectRoot;
      const androidRoot = config.modRequest.platformProjectRoot;

      const backupRoot = path.isAbsolute(backupRootEnv)
        ? backupRootEnv
        : path.join(projectRoot, backupRootEnv);

      const keystoreEnv = process.env.ANDROID_KEYSTORE_FILE;

      const files = [
        {
          from: keystoreEnv,
          to: keystoreEnv,
        },
        {
          from: 'gradle.properties',
          to: 'gradle.properties',
        },
        {
          from: 'app/build.gradle',
          to: 'app/build.gradle',
        },
      ];

      files.forEach(({ from, to }) => {
        const src = path.join(backupRoot, from);
        const dest = path.join(androidRoot, to);

        if (!fs.existsSync(src)) {
          throw new Error(`Missing backup file: ${src}`);
        }

        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.copyFileSync(src, dest);
      });

      console.log('Restored Android custom files');

      return config;
    },
  ]);
};