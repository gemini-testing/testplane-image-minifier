# hermione-image-minifier

## Overview

Use the `hermione-image-minifier` plugin to compress images (screenshots) in your tests.

The plugin supports 8 compression levels: from 0 (do not apply compression) to 7 (maximum compression level).

Compression is lossless.

### How does it work?

At startup, the plugin subscribes to the `UPDATE_REFERENCE` event, which Hermione sends in the following cases:
* if the user started hermione by passing the `--update-refs` option;
* if the user updates or saves screenshots using the [html-reporter][html-reporter] plugin.

When the `UPDATE_REFERENCE` event is received in the `hermione-image-minifier` plugin, it gets a link to the image itself along with the event. Next, the plugin applies a compression algorithm to the received image with the compression level specified in the config. And saves the new image to the file system. After that, the developer can merge the updated files into the main branch of his project.

To compress images, the `hermione-image-minifier` plugin uses the [optipng-bin][optipng-bin] package.

_When choosing the compression level for images in your project, remember that you are choosing between the speed and the space that your images will occupy on disk. The higher the compression ratio, the less space your images will occupy on disk, but the tests themselves will take longer. Since before comparing the images in the tests, the system will have to unpack them. Therefore, in order to get an acceptable test run time, match the selected compression ratio with the capacity of the servers on which these tests will be running._

## Install

```bash
npm install -D hermione-image-minifier
```

## Setup

Add the plugin to the `plugins` section of the `hermione` config:

```javascript
module.exports = {
    plugins: {
        'hermione-image-minifier': {
            enabled: true, // Enable the plugin.
            compressionLevel: 7 // Maximum compression level, compression will take some time
        },

        // other hermione plugins...
    },

    // other hermione settings...
};
```

### Description of configuration parameters

| **Parameter** | **Type** | **Default&nbsp;value** | **Description** |
| :--- | :---: | :---: | :--- |
| enabled | Boolean | true | Enable / disable the plugin. |
| compressionLevel | Number | 2 | Image compression level: from 0 to 7 (maximum compression level). |

### Passing parameters via the CLI

All plugin parameters that can be defined in the config can also be passed as command-line options or through environment variables during the launch of Hermione. Use the prefix `--image-minifier-` for command line options and `hermione_image_minifier_` for environment variables. For example:

```bash
npx hermione --image-minifier-compression-level 5
```

```bash
hermione_image_minifier_compression_level = 5 npx hermione
```

## Debugging

Set the environment variable `DEBUG=hermione:image-minifier` to see messages in the console about the application of the compression algorithm for images in tests.

```bash
DEBUG=hermione:image-minifier npx hermione --update-refs
```

An example of how it will look in the console:

```bash
/path/to/reference/image.png compressed by 30%
```

## Usage

After adding the plugin to the project and configuring its parameters, run hermione with the `--update-refs` option:

```bash
npx hermione --update-refs
```

The images on the file system will be updated.

## Useful links

* [hermione-image-minifier plugin sources][hermione-image-minifier]
* [optipng-bin package to compress images][optipng-bin]

[hermione-image-minifier]: https://github.com/gemini-testing/hermione-image-minifier/
[html-reporter]: https://docs.yandex-team.ru/hermione/plugins/html-reporter
[optipng-bin]: https://www.npmjs.com/package/optipng-bin
