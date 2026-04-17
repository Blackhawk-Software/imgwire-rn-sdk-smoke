# imgwire-rn-sdk-smoke

Expo example app for validating `@imgwire/react-native@0.1.1` in a real React Native runtime.

This project is intentionally small and inspection-friendly. It is meant to show how to wire the SDK into an Expo app and how to manually verify the most important runtime flows.

## Included scenarios

- `ImgwireProvider` setup
- image rendering by direct URL
- image rendering by Imgwire image ID
- transform URL behavior
- `useFetchImage` success, retry, and invalid-ID error states
- `useResponsiveImage` breakpoint switching
- `useUpload` with Expo image-picker local file URIs
- upload progress and cancellation via `AbortController`
- isolated missing-provider hook example
- invalid upload URI error handling

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the example env file and fill in your test values. Use a publishable key only.

```bash
cp .env.example .env
```

3. Set these values:

- `EXPO_PUBLIC_IMGWIRE_API_KEY`
- `EXPO_PUBLIC_IMGWIRE_BASE_URL` if you need a non-default API host
- `EXPO_PUBLIC_IMGWIRE_IMAGE_ID`
- `EXPO_PUBLIC_IMGWIRE_IMAGE_URL`
- `EXPO_PUBLIC_IMGWIRE_INVALID_IMAGE_ID` is optional and defaults to `img_invalid_smoke_test`

4. Start Expo:

```bash
npx expo start
```

5. Open the app in Expo Go or a simulator and work through each section of the harness.

## Configuration

The app reads values from Expo public env vars in [src/config.ts](/Users/shaneprrlt/Developer/imgwire/react-native-sdk-test/src/config.ts). Safe placeholder defaults are kept in source so the example can be published without real credentials.

Do not commit real keys or project-specific image IDs/URLs into `src/config.ts`.

## Runtime notes

- This app is intended for iOS and Android Expo runtimes. Upload behavior is specifically wired for native local file URIs from `expo-image-picker`.
- The harness keeps all success-path scenarios inside `ImgwireProvider`, then renders one isolated hook example outside the provider to show the missing-provider error state without crashing the rest of the app.
- Key outputs are shown in UI and also logged to the console for fetch, responsive URL, and upload events.

## Example structure

- [App.tsx](/Users/shaneprrlt/Developer/imgwire/react-native-sdk-test/App.tsx) wires `ImgwireProvider` and renders the smoke-test sections.
- [src/config.ts](/Users/shaneprrlt/Developer/imgwire/react-native-sdk-test/src/config.ts) reads Expo public env vars and exposes safe defaults.
- [src/screens](/Users/shaneprrlt/Developer/imgwire/react-native-sdk-test/src/screens) contains one screen component per scenario.
- [TESTED_SCENARIOS.md](/Users/shaneprrlt/Developer/imgwire/react-native-sdk-test/TESTED_SCENARIOS.md) is a manual verification checklist for this app.

## Validation

Static checks used while preparing this example:

```bash
npx tsc --noEmit
npx expo export --platform ios --platform android
```
