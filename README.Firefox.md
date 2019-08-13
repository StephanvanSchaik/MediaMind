Building
========

Install the dependencies to build the web extension:

```
cd webext
npm i
```

Build the web extension:

```
npm run build firefox
```

Installation
============

1. Run the setup assistant:
```
cd setup
./target/release/setup ../native/target/release/media_mind
```

Alternatively, you can install the `media_mind` binary somewhere else and specify the path.

2. Open Mozilla Firefox and open the following URL: `about:debugging`.
3. Go to the add-ons page and enable the checkbox next to "Enable add-on debugging" if present.
4. Click the "Load Temporary Add-on..." button.
5. Point the file browser to "webext/dist/firefox" within the repository and it will load the extension.
