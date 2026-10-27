# Shlok Portfolio

Personal portfolio mobile app, built with [Expo](https://expo.dev) and React Native.

This repository is a clean Expo starter so screens and features can be added next. It uses the current default `create-expo-app` template: TypeScript, [Expo Router](https://docs.expo.dev/router/introduction/) file-based navigation, and Expo SDK 58.

The Home and Explore tabs are the template's example screens. Replace them as the portfolio takes shape.

## Prerequisites

- [Node.js](https://nodejs.org/) 22.13 or newer (Expo SDK 58)
- npm, which ships with Node.js
- A way to preview the app:
  - [Expo Go](https://expo.dev/go) on a phone, once the SDK 58 store release is installed
  - an Android emulator
  - the iOS Simulator (macOS with Xcode)
  - a web browser

Store builds of Expo Go were still catching up to SDK 58 when this project was created. If Expo Go reports an SDK mismatch, open the project on web, in an emulator or simulator, or with a [development build](https://docs.expo.dev/develop/development-builds/introduction/).

## Run

Install dependencies, then start the Expo dev server:

```bash
npm install
npx expo start
```

`npm start` runs the same server. In the terminal UI:

- scan the QR code to open the project on a device
- press `a` for an Android emulator
- press `i` for the iOS Simulator
- press `w` for web

You can also start a target directly:

```bash
npm run android
npm run ios
npm run web
```

Edit files in `src/app` and the dev server reloads the app.

## Project structure

| Path | Purpose |
| --- | --- |
| `src/app/` | Routes. `index.tsx` is Home, `explore.tsx` is Explore, and `_layout.tsx` sets up navigation. |
| `src/components/` | Shared UI used by the starter screens. |
| `src/constants/theme.ts` | Colors and layout tokens. |
| `assets/` | App icon, splash image, and tab icons. |
| `app.json` | Expo config. The app name is `ShlokPortfolio`. |

When you want a blank route tree, run:

```bash
npm run reset-project
```

That moves the starter screens into `example/` and leaves an empty `src/app` directory.

## Purpose

This app is the mobile home for Shlok's personal portfolio. The current code is only the scaffold: navigation and a place to add screens, not portfolio content yet.
