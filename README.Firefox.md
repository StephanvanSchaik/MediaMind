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

Run the setup assistant:

```
cd setup
./target/release/setup ../native/target/release/media_mind
```

Alternatively, you can install the `media_mind` binary somewhere else and specify the path.

Open Mozilla Firefox and open the following URL: `about:debugging`.

Go to the add-ons page and enable the checkbox next to "Enable add-on debugging" if present.

Click the "Load Temporary Add-on..." button.

Point the file browser to "webext/dist/firefox" within the repository and it will load the extension.

