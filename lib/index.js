'use strict';

const parseConfig = require('./config');
const Minifier = require('./minifier');

module.exports = (hermione, opts) => {
    const pluginConfig = parseConfig(opts);

    if (!pluginConfig.enabled) {
        return;
    }

    const minifier = Minifier.create(opts);

    hermione.on(hermione.events.UPDATE_REFERENCE, ({refImg}) => {
        minifier.minify(refImg.path);
    });
};
