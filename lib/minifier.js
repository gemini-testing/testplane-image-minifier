'use strict';

const childProcess = require('child_process');
const fs = require('fs-extra');
const debugLog = require('debug')('hermione:image-minifier');
const optipng = require('optipng-bin');
const Promise = require('bluebird');
const execFile = Promise.promisify(childProcess.execFile);
const {logger} = require('./utils');

module.exports = class Minifier {
    static create(opts) {
        return new Minifier(opts);
    }

    constructor(opts) {
        this._compressionLevel = opts.compressionLevel;
    }

    async minify(imagePath) {
        try {
            const sizeBefore = await this._getImageSize(imagePath);
            await execFile(optipng, ['-o', this._compressionLevel, imagePath]);
            const sizeAfter = await this._getImageSize(imagePath);

            const compressionRate = Minifier._calcCompressionRate(sizeBefore, sizeAfter);

            debugLog(`${imagePath} compressed by ${compressionRate}%`);
        } catch (err) {
            logger.warn(`WARN: Failed to minify reference image: ${imagePath}, error: ${err}`);
        }
    }

    async _getImageSize(imagePath) {
        const stat = await fs.stat(imagePath);
        return stat.size;
    }

    static _calcCompressionRate(sizeBefore, sizeAfter) {
        return 100 - Math.round(sizeAfter * 100 / sizeBefore);
    }
};
