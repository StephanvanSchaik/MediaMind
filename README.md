# Introduction

MediaMind is a WebExtension add-on that allows you to use the multimedia keys
on your keyboard to control the media playback in your browser.

# Supported platforms

 * Microsoft Windows
 * Linux

# Supported browsers

 * Mozilla Firefox 64.0 or later
 * Google Chrome 74.0 or later

# Supported websites

 * YouTube (https://youtube.com)
 * Spotify (https://open.spotify.com)

# Prerequisites

 * Rust and Cargo
 * `npm`
 * `npx` (run `npm install -g npx`)

# Building

Clone this repository:

```
git clone https://github.com/StephanvanSchaik/MediaMind
```

Build the native application:

```
cd native
cargo build --release
```

Build the setup assistant:

```
cd setup
cargo build --release
```

Installing the dependencies for building the web extension:

```
cd webext
npm i
```

# Installation

 * [Mozilla Firefox](./README.Firefox.md)
 * [Google Chrome](./README.Chrome.md)
