import extractMetaTags from './extract';
import {
  isCustomMetaTagsValid,
  optionSetup,
} from './utils';
import type { OpenGraphScraperOptions } from './types';

/**
 * sets up options for the fetch request and calls extract on html
 *
 * @param {object} options - options for ogs
 * @return {object} object with ogs results
 *
 */
export default async function setOptionsAndReturnOpenGraphResults(ogsOptions: OpenGraphScraperOptions) {
  const { options } = optionSetup(ogsOptions);

  if (!options.html) throw new Error('Must pass in `html` option.');

  if (!isCustomMetaTagsValid(options.customMetaTags ?? [])) throw new Error('Invalid Custom Meta Tags');

  const ogObject = extractMetaTags(options.html, options);
  ogObject.success = true;
  return { ogObject, response: { body: options.html }, html: options.html };
}
