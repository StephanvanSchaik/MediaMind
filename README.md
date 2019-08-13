# Introduction

MediaMind is a WebExtension add-on that allows you to use the multimedia keys
on your keyboard to control the media playback in your browser.

# Supported browsers

 * Mozilla Firefox 64.0 or later
 * Google Chrome 74.0 or later

# Supported websites

 * YouTube (https://youtube.com)
 * Spotify (https://open.spotify.com)

# Prerequisites

 * Rust and Cargo
 * `npm`

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

Installing the dependencies for building the web extension:

```
cd webext
npm i
```

Building the web extension for Google Chrome:

```
npm run build chrome
```

Building the web extension for Mozilla Firefox:

```
npm run build firefox
```

# Installation

TODO
