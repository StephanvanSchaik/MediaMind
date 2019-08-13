Building
========

Install the dependencies to build the web extension:

```
cd webext
npm i
```

Build the web extension:

```
npm run build chrome
```

Installation
============

# Open Google Chrome and go to [chrome://extensions](chrome://extensions).
# Enable developer mode.
# Click the "Load Unpacked" button.
# Point to dist/chrome in the repository.
# Take note of the Chrome extension ID.
# Run the setup assistant and replace `<extension ID>` with the extension ID:
```
cd setup
./target/release/setup ../native/target/release/media_mind chrome://<extension
ID>/
```
# Reload the Chrome extension.
