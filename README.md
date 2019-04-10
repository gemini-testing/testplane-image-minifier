# hermione-image-minifier

[![NPM version](https://img.shields.io/npm/v/hermione-image-minifier.svg?style=flat)](https://www.npmjs.org/package/hermione-image-minifier)
[![Build Status](https://travis-ci.org/gemini-testing/hermione-image-minifier.svg?branch=master)](https://travis-ci.org/gemini-testing/hermione-image-minifier)

Plugin for [hermione](https://github.com/gemini-testing/hermione) to minificate reference images (uses [optipng](https://github.com/imagemin/optipng-bin).

## Installation

```bash
npm install hermione-image-minifier
```

## Configuration

Plugin has following configuration:

* **enabled** (optional) `Boolean` – enable/disable the plugin; by default plugin is enabled
* **compressionLevel** (optional) `Number` - compression level from 0 to 7; by default 2

Also there is ability to override plugin parameters by CLI options or environment variables
(see [configparser](https://github.com/gemini-testing/configparser)).
Use `hermione_image_minifier_` prefix for the environment variables and `--hermione-image-minifier-` for the cli options.

## Usage

Add plugin to your `hermione` config file:

```js
module.exports = {
    // ...
    system: {
        plugins: {
            'hermione-image-minifier': {
                enabled: true,
                compressionLevel: 7 // maximal compression, but takes the most time
            }
        }
    },
    //...
}
```

## Debug mode

To turn on debug mode set `DEBUG=hermione:image-minifier` enviroment variable:

```bash
$ DEBUG=hermione:image-minifier ./node_modules/.bin/hermione --update-refs
```

Console output:

```bash
/path/to/reference/image.png compressed by 30%
```
