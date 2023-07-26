import validator from 'validator';
import type { ValidatorSettings, OpenGraphScraperOptions } from './types';

export const defaultUrlValidatorSettings = {
  allow_fragments: true,
  allow_protocol_relative_urls: false,
  allow_query_components: true,
  allow_trailing_dot: false,
  allow_underscores: false,
  protocols: ['http', 'https'],
  require_host: true,
  require_port: false,
  require_protocol: false,
  require_tld: true,
  require_valid_protocol: true,
  validate_length: true,
};

/**
 * Checks if URL is valid
 *
 * @param {string} url - url to be checked
 * @param {string} urlValidatorSettings - settings used by validator
 * @return {boolean} boolean value if the url is valid
 *
 */
export function isUrlValid(url: string, urlValidatorSettings: ValidatorSettings): boolean {
  return typeof url === 'string' && url.length > 0 && validator.isURL(url, urlValidatorSettings);
}

/**
 * Finds the image type from a given url
 *
 * @param {string} url - url to be checked
 * @return {string} image type from url
 *
 */
export function findImageTypeFromUrl(url: string): string {
  let type: string = url.split('.').pop() || '';
  [type] = type.split('?');
  return type;
}

/**
 * Checks if image type is valid
 *
 * @param {string} type - type to be checked
 * @return {boolean} boolean value if type is value
 *
 */
export function isImageTypeValid(type: string): boolean {
  const validImageTypes: string[] = ['apng', 'bmp', 'gif', 'ico', 'cur', 'jpg', 'jpeg', 'jfif', 'pjpeg', 'pjp', 'png', 'svg', 'tif', 'tiff', 'webp'];
  return validImageTypes.includes(type);
}

/**
 * Find and delete nested undefs
 *
 * @param {object} object - object to be cleaned
 * @return {object} object without nested undefs
 *
 */
export function removeNestedUndefinedValues(object: { [key: string]: any }): { [key: string]: any } {
  Object.entries(object).forEach(([key, value]) => {
    if (value && typeof value === 'object') removeNestedUndefinedValues(value);
    else if (value === undefined) delete object[key];
  });
  return object;
}

/**
 * Split the options object into ogs and got option objects
 *
 * @param {object} options - options that need to be split
 * @return {object} object with nested options for ogs and got
 *
 */
export function optionSetup(ogsOptions: OpenGraphScraperOptions): { options: OpenGraphScraperOptions } {
  const options: OpenGraphScraperOptions = {
    onlyGetOpenGraphInfo: false,
    ...ogsOptions,
  };

  return { options };
}
