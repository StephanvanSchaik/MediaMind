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

1. Open Google Chrome and go to [chrome://extensions](chrome://extensions).
2. Enable developer mode.
3. Click the "Load Unpacked" button.
4. Point to dist/chrome in the repository.
5. Take note of the Chrome extension ID.
6. Run the setup assistant and replace `<extension ID>` with the extension ID:
```
cd setup
./target/release/setup ../native/target/release/media_mind chrome://<extension
ID>/
```
7. Reload the Chrome extension.
