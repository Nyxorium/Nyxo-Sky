

# APK Build
`cd ./android`
`./gradlew assembleRelease`
(Makes an APK, stores it in android/build/outputs/apk/release I believe)


# Lang Update
`yarn intl:build`
(important after adding anything with Trans otherwise it'll show as random characters)


# Android Build
`yarn prebuild -p android` || `yarn prebuild -p android --no-clean`
`yarn android` || `yarn android --variant release`


# APK Signing (initial gen)
`keytool -genkey -v -keystore nyxo-release.keystore -alias nyxo -keyalg RSA -keysize 2048 -validity 10000`
(Change nyxo-release & nyxo)


# Copying
rsync -av --progress \
  --exclude 'node_modules' \
  --exclude '.git' \
  --exclude 'code-signing' \
  --exclude 'LICENSE' \
  /Nyxo-Sky/versions/1.110.0/ /Nyxo-Sky/Nyxorium/

(This is because github is annoying and I don't want to learn it...)
(Easier to have everything in the main project directory tied to the upstream, 
than copy everything to a new directiory tied to the repo I'm pushing too when I need to)


# Deleting old files in other directory
`find . -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf {} +`


# For checking the state of values
<Trans>Value name here</Trans>
{' - '}
{ValueVariableHere ? "Enabled" : "Disabled"}