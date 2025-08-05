# React TopLoader 🏋🏼‍♂️

[![NPM Latest Version][version-badge]][npm-url] [![Coverage Status][coverage-badge]][coverage-url] [![Socket Status][socket-badge]][socket-url] [![NPM Monthly Downloads][downloads-badge]][npm-url] [![Dependencies][deps-badge]][deps-url]

[version-badge]: https://img.shields.io/npm/v/%40alessiofrittoli%2Freact-top-loader
[npm-url]: https://npmjs.org/package/%40alessiofrittoli%2Freact-top-loader
[coverage-badge]: https://coveralls.io/repos/github/alessiofrittoli/react-top-loader/badge.svg
[coverage-url]: https://coveralls.io/github/alessiofrittoli/react-top-loader
[socket-badge]: https://socket.dev/api/badge/npm/package/@alessiofrittoli/react-top-loader
[socket-url]: https://socket.dev/npm/package/@alessiofrittoli/react-top-loader/overview
[downloads-badge]: https://img.shields.io/npm/dm/%40alessiofrittoli%2Freact-top-loader.svg
[deps-badge]: https://img.shields.io/librariesio/release/npm/%40alessiofrittoli%2Freact-top-loader
[deps-url]: https://libraries.io/npm/%40alessiofrittoli%2Freact-top-loader
[sponsor-badge]: https://img.shields.io/static/v1?label=Fund%20this%20package&message=%E2%9D%A4&logo=GitHub&color=%23DB61A2
[sponsor-url]: https://github.com/sponsors/alessiofrittoli

## Displays a top loader progress while navigating on a different page

### Table of Contents

- [Getting started](#getting-started)
- [API Reference](#api-reference)
  - [React Components](#react-components)
    - [`TopLoader`](#toploader)
    - [`TopLoaderProgressBar`](#toploaderprogressbar)
  - [React Hooks](#react-hooks)
    - [`useTopLoaderApi`](#usetoploaderapi)
    - [`useTopLoader`](#usetoploader)
- [Development](#development)
  - [Install depenendencies](#install-depenendencies)
  - [Build the source code](#build-the-source-code)
  - [ESLint](#eslint)
  - [Jest](#jest)
- [Contributing](#contributing)
- [Security](#security)
- [Credits](#made-with-)

---

### Getting started

Run the following command to start using `react-top-loader` in your projects:

```bash
npm i @alessiofrittoli/react-top-loader
```

or using `pnpm`

```bash
pnpm i @alessiofrittoli/react-top-loader
```

---

### Overview

Progress updates aren't managed via React state updates but they're based on simple CSS modifications.

This library listen for link clicks, history push and replace states and checks effective navigation in order to start updating navigation progresses.

To avoid negatively impacting your application INP value we use the [`useDeferCallback`](https://npmjs.com/package/@alessiofrittoli/react-hooks#usedefercallback) exported by [`@alessiofrittoli/react-hooks`](https://npmjs.com/package/@alessiofrittoli/react-hooks) library which defers tasks attached to user interactions.

---

### API Reference

#### React Components

##### `TopLoader`

Displays a top loader progress while navigating on a different page.

⚠️ This Component should be mounted once, preferably in the root layout of your application and shouldn't be unmounted when navigating on a different page.

This Component internally use the [`TopLoaderProvider`](#toploaderprovider) Component in order to expose the [`useTopLoaderApi`](#usetoploaderapi) widely in your app.

<details>

<summary style="cursor:pointer">Component Props</summary>

| Property    | Type                                  | Description                                                                                                                                |
| ----------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `Component` | `React.FC<TopLoaderProgressBarProps>` | A React Component which renders a custom progress bar. It must accepts [`TopLoaderProgressBarProps`](#toploaderprogressbarprops) as props. |

Other properties are inherited by the [`TopLoaderProviderProps`](#toploaderproviderprops) and [`TopLoaderProgressBarProps`](#toploaderprogressbarprops).

</details>

---

##### `TopLoaderProgressBar`

Simple TopLoader progress bar.

It requires a React.RefObject through the `progressBarRef` property which will be used to update the progress bar styles based on the current progress value.

This Component is internally used by the [`TopLoader`](#toploader) Component but it is exported for custom implementations.

###### `TopLoaderProgressBarProps`

<details>

<summary style="cursor:pointer">Component Props</summary>

| Property         | Type                                    | Description                                                                                                                     |
| ---------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `progressBarRef` | `React.RefObject<HTMLDivElement\|null>` | The `React.RefObject` attached to the `HTMLDivElement` which is then used to update styles based on the current progress value. |

Other properties are inherited by the `React.ComponentProps<'div'>` type and not documented here.

</details>

---

#### React Hooks

##### `useTopLoaderApi`

TopLoader base API React hook.

It provides status and methods needed to easly handle continuous progress update.

This hook is internally used by [`TopLoaderProvider`](#toploaderprovider) Component but it is exported for custom implementations.

<details>

<summary style="cursor:pointer">Parameters</summary>

| Parameter         | Type                     | Default | Description                                                    |
| ----------------- | ------------------------ | ------- | -------------------------------------------------------------- |
| `options`         | `UseTopLoaderApiOptions` | `{}`    | An object defining custom options.                             |
| `options.onStart` | `OnStartHandler`         | -       | A custom callback executed when the `start` method is called.  |
| `options.onTick`  | `OnTickHandler`          | -       | A custom callback executed when the progress value is updated. |
| `options.onStop`  | `OnStopHandler`          | -       | A custom callback executed when the `stop` method is called.   |

</details>

---

<details>

<summary style="cursor:pointer">Returns</summary>

Type: `UseTopLoaderApi`

An object defining progress status and methods.

- playing: `React.RefObject<boolean>` - A React.RefObject indicating whether the work is currently playing or not.
- progress: `React.RefObject<number>` - A React.RefObject indicating the current progress value.
- start: `() => void` - Start the TopLoader work.
- tick: `( amount?: number ) => boolean` - Tick TopLoader progress.
- stop: `() => void` - Set progress to `100` and stop the TopLoader work.

</details>

---

##### `useTopLoader`

Access to the TopLoader React Context API.

<details>

<summary style="cursor:pointer">Returns</summary>

Type: `UseTopLoaderApi`

This hooks returns the [`useTopLoaderApi`](#usetoploaderapi) result exposed through the [`TopLoaderContext`](#toploadercontext).

</details>

---

### Development

#### Install depenendencies

```bash
npm install
```

or using `pnpm`

```bash
pnpm i
```

#### Build the source code

Run the following command to test and build code for distribution.

```bash
pnpm build
```

#### [ESLint](https://www.npmjs.com/package/eslint)

warnings / errors check.

```bash
pnpm lint
```

#### [Jest](https://npmjs.com/package/jest)

Run all the defined test suites by running the following:

```bash
# Run tests and watch file changes.
pnpm test:watch

# Run tests in a CI environment.
pnpm test:ci
```

- See [`package.json`](./package.json) file scripts for more info.

Run tests with coverage.

An HTTP server is then started to serve coverage files from `./coverage` folder.

⚠️ You may see a blank page the first time you run this command. Simply refresh the browser to see the updates.

```bash
test:coverage:serve
```

---

### Contributing

Contributions are truly welcome!

Please refer to the [Contributing Doc](./CONTRIBUTING.md) for more information on how to start contributing to this project.

Help keep this project up to date with [GitHub Sponsor][sponsor-url].

[![GitHub Sponsor][sponsor-badge]][sponsor-url]

---

### Security

If you believe you have found a security vulnerability, we encourage you to **_responsibly disclose this and NOT open a public issue_**. We will investigate all legitimate reports. Email `security@alessiofrittoli.it` to disclose any security vulnerabilities.

### Made with ☕

<table style='display:flex;gap:20px;'>
  <tbody>
    <tr>
      <td>
        <img alt="avatar" src='https://avatars.githubusercontent.com/u/35973186' style='width:60px;border-radius:50%;object-fit:contain;'>
      </td>
      <td>
        <table style='display:flex;gap:2px;flex-direction:column;'>
          <tbody>
              <tr>
                <td>
                  <a href='https://github.com/alessiofrittoli' target='_blank' rel='noopener'>Alessio Frittoli</a>
                </td>
              </tr>
              <tr>
                <td>
                  <small>
                    <a href='https://alessiofrittoli.it' target='_blank' rel='noopener'>https://alessiofrittoli.it</a> |
                    <a href='mailto:info@alessiofrittoli.it' target='_blank' rel='noopener'>info@alessiofrittoli.it</a>
                  </small>
                </td>
              </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>
