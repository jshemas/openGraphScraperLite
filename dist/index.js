"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable max-len, import/no-import-module-exports */
const openGraphScraper_1 = __importDefault(require("./lib/openGraphScraper"));
/**
 * `open-graph-scraper` uses [fetch](https://developer.mozilla.org/en-US/docs/Web/API/fetch) for http requests
 * for scraping Open Graph and Twitter Card info off a website.
 *
 * @param {object} options - The options used by Open Graph Scraper
 * @param {boolean} [options.onlyGetOpenGraphInfo] - Only fetch open graph info and don't fall back on anything else.
 * @param {object} [options.customMetaTags] - Here you can define custom meta tags you want to scrape.
 * @param {string} options.html - You can pass in an HTML string to run ogs on it. (use without options.url)
 * @returns {Promise} Promise Object with the Open Graph results
 */
async function run(options) {
    let results;
    try {
        results = await (0, openGraphScraper_1.default)(options);
    }
    catch (error) {
        const exception = error;
        const returnError = {
            error: true,
            result: {
                success: false,
                error: exception.message,
                errorDetails: exception,
            },
            html: undefined,
        };
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw returnError;
    }
    const returnSuccess = {
        error: false,
        result: results.ogObject,
        html: results.html,
    };
    return returnSuccess;
}
exports.default = run;
module.exports = run;
