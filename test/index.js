'use strict';

const {EventEmitter} = require('events');
const _ = require('lodash');
const plugin = require('lib');
const Minifier = require('lib/minifier');

describe('plugin', () => {
    const mkHermione_ = (opts = {}) => {
        opts = _.defaults(opts, {
            proc: 'master',
            browsers: {}
        });

        const hermione = new EventEmitter();
        hermione.events = {UPDATE_REFERENCE: 'updateReference'};
        hermione.isWorker = sinon.stub().returns(opts.proc === 'worker');

        return hermione;
    };

    beforeEach(() => {
        sinon.stub(Minifier, 'create').returns(Object.create(Minifier.prototype));
        sinon.stub(Minifier.prototype, 'minify').resolves();
    });

    afterEach(() => sinon.restore());

    it('should do nothing if plugin is disabled', () => {
        const hermione = mkHermione_();
        sinon.spy(hermione, 'on');

        plugin(hermione, {enabled: false});

        assert.notCalled(hermione.on);
    });

    ['master', 'worker'].forEach((proc) => {
        describe(`${proc} process`, () => {
            it('should update reference image', () => {
                const hermione = mkHermione_({proc});

                plugin(hermione, {compressionLevel: 3});

                hermione.emit(hermione.events.UPDATE_REFERENCE, {refImg: {path: '/ref/path'}});

                assert.calledOnceWith(Minifier.create, {compressionLevel: 3});
                assert.calledOnceWith(Minifier.prototype.minify, '/ref/path');
            });
        });
    });
});
