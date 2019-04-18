'use strict';

const _ = require('lodash');
const {root, section, option} = require('gemini-configparser');
const {enabled, compressionLevel} = require('./defaults');
const {thr} = require('../utils');

const ENV_PREFIX = 'hermione_image_minifier_';
const CLI_PREFIX = '--hermione-image-minifier-';

const assertType = (name, validationFn, type) => {
    return (v) => !validationFn(v) && thr(`"${name}" option must be ${type}, but got ${typeof v}`);
};

const assertBoolean = (name) => assertType(name, _.isBoolean, 'boolean');
const assertIntegerInRange = (value, name, {min, max}) => {
    if (!_.isNumber(value)) {
        thr(`"${name}" option must be number, but got ${typeof value}`);
    }

    if (value < min || value > max) {
        thr(`"${name}" option must be in range from ${min} to ${max}, but got ${value}`);
    }
};

const getParser = () => {
    return root(section({
        enabled: option({
            defaultValue: enabled,
            parseEnv: JSON.parse,
            parseCli: JSON.parse,
            validate: assertBoolean('enabled')
        }),
        compressionLevel: option({
            defaultValue: compressionLevel.value,
            parseEnv: JSON.parse,
            parseCli: JSON.parse,
            validate: (value) => {
                return assertIntegerInRange(
                    value,
                    'compressionLevel',
                    {min: compressionLevel.min, max: compressionLevel.max}
                );
            }
        })
    }), {envPrefix: ENV_PREFIX, cliPrefix: CLI_PREFIX});
};

module.exports = (options) => {
    const {env, argv} = process;

    return getParser()({options, env, argv});
};
