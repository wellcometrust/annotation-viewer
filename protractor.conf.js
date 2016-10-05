/**
 * Protractor configuration
 *
 */

exports.config = {
    baseUrl: 'http://localhost:3000',
    specs: [
        'test/e2e/*.spec.js'
    ],
    capabilities: {
        browserName: 'chrome'
    },
    chromeOnly: false,
    directConnect: false,
    rootElement: 'body'
};