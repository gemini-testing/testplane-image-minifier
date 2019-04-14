'use strict';

const childProcess = require('child_process');
const fs = require('fs-extra');
const optipng = require('optipng-bin');
const proxyquire = require('proxyquire');
const {logger} = require('lib/utils');

describe('minifier', () => {
    let Minifier, debugLog;

    beforeEach(() => {
        sinon.stub(fs, 'stat').resolves({size: 100500});
        sinon.stub(childProcess, 'execFile').yields(null);
        sinon.stub(logger, 'warn');

        debugLog = sinon.stub();

        Minifier = proxyquire('../lib/minifier', {
            debug: () => debugLog
        });
    });

    afterEach(() => sinon.restore());

    it('should minify image by passed path and compression level', async () => {
        const imagePath = '/ref/path';
        const compressionLevel = 7;

        const minifier = Minifier.create({compressionLevel});

        await minifier.minify(imagePath);

        assert.calledOnceWith(childProcess.execFile, optipng, ['-o', compressionLevel, imagePath]);
    });

    it('should handle error on fail in minification', async () => {
        const error = new Error('foo');
        childProcess.execFile.yields(error);
        const imagePath = '/ref/path';
        const compressionLevel = 7;

        const minifier = Minifier.create({compressionLevel});

        await assert.isFulfilled(minifier.minify(imagePath));

        assert.calledOnceWith(logger.warn, `WARN: Failed to minify reference image: /ref/path, error: ${error}`);
    });

    it('should log rate on which reference image has been compressed', async () => {
        const imagePath = '/ref/path';
        const sizeBeforeCompress = 200;
        const sizeAfterCompress = 100;
        const compressionRate = 50;

        fs.stat
            .onFirstCall().resolves({size: sizeBeforeCompress})
            .onSecondCall().resolves({size: sizeAfterCompress});

        const minifier = Minifier.create({compressionLevel: 7});

        await minifier.minify(imagePath);

        assert.calledOnceWith(debugLog, `${imagePath} compressed by ${compressionRate}%`);
    });
});
