'use strict';

const parseConfig = require('lib/config');
const defaults = require('lib/config/defaults');

describe('config', () => {
    describe('"enabled" option', () => {
        it('should be enabled by default', () => {
            assert.isTrue(parseConfig({}).enabled);
        });
    });

    describe('"compressionLevel" option', () => {
        it(`should be set to ${defaults.compressionLevel} by default`, () => {
            assert.equal(parseConfig({}).compressionLevel, defaults.compressionLevel.value);
        });

        describe('should throw error if option is', () => {
            it('not a number', () => {
                assert.throws(
                    () => parseConfig({compressionLevel: '15'}),
                    Error,
                    '"compressionLevel" option must be number, but got string'
                );
            });

            it('less than 0', () => {
                const {compressionLevel: {min, max}} = defaults;

                assert.throws(
                    () => parseConfig({compressionLevel: -1}),
                    Error,
                    `"compressionLevel" option must be in range from ${min} to ${max}, but got -1`
                );
            });

            it('more than 7', () => {
                const {compressionLevel: {min, max}} = defaults;

                assert.throws(
                    () => parseConfig({compressionLevel: 8}),
                    Error,
                    `"compressionLevel" option must be in range from ${min} to ${max}, but got 8`
                );
            });
        });

        it('should set "compressionLevel" option', () => {
            const config = parseConfig({compressionLevel: 3});

            assert.equal(config.compressionLevel, 3);
        });
    });
});
