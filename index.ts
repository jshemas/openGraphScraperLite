/* eslint-disable max-len, import/no-import-module-exports */
import setOptionsAndReturnOpenGraphResults from './lib/openGraphScraper';
import type {
  OpenGraphScraperOptions,
  OgObject,
} from './lib/types';

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
export default async function run(options: OpenGraphScraperOptions): Promise<ErrorResult | SuccessResult> {
  let results;
  try {
    results = await setOptionsAndReturnOpenGraphResults(options);
  } catch (error) {
    const exception = error as Error;
    const returnError:ErrorResult = {
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
  const returnSuccess: SuccessResult = {
    error: false,
    result: results.ogObject,
    html: results.html,
  };
  return returnSuccess;
}

module.exports = run;

export interface SuccessResult {
  error: false;
  html: string;
  result: OgObject;
}

export interface ErrorResult {
  error: true;
  html: undefined;
  result: OgObject;
}
