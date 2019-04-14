'use strict';

exports.thr = (str) => {
    throw new TypeError(str);
};

exports.logger = {
    log: console.log,
    warn: console.warn,
    error: console.error
};
