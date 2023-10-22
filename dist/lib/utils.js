"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionSetup = exports.removeNestedUndefinedValues = exports.isImageTypeValid = exports.findImageTypeFromUrl = exports.isUrlValid = exports.defaultUrlValidatorSettings = void 0;
const validator_1 = __importDefault(require("validator"));
exports.defaultUrlValidatorSettings = {
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
function isUrlValid(url, urlValidatorSettings) {
    return typeof url === 'string' && url.length > 0 && validator_1.default.isURL(url, urlValidatorSettings);
}
exports.isUrlValid = isUrlValid;
/**
 * Finds the image type from a given url
 *
 * @param {string} url - url to be checked
 * @return {string} image type from url
 *
 */
function findImageTypeFromUrl(url) {
    let type = url.split('.').pop() || '';
    [type] = type.split('?');
    return type;
}
exports.findImageTypeFromUrl = findImageTypeFromUrl;
/**
 * Checks if image type is valid
 *
 * @param {string} type - type to be checked
 * @return {boolean} boolean value if type is value
 *
 */
function isImageTypeValid(type) {
    const validImageTypes = ['apng', 'bmp', 'gif', 'ico', 'cur', 'jpg', 'jpeg', 'jfif', 'pjpeg', 'pjp', 'png', 'svg', 'tif', 'tiff', 'webp'];
    return validImageTypes.includes(type);
}
exports.isImageTypeValid = isImageTypeValid;
/**
 * Find and delete nested undefs
 *
 * @param {object} object - object to be cleaned
 * @return {object} object without nested undefs
 *
 */
function removeNestedUndefinedValues(object) {
    Object.entries(object).forEach(([key, value]) => {
        if (value && typeof value === 'object')
            removeNestedUndefinedValues(value);
        else if (value === undefined)
            delete object[key];
    });
    return object;
}
exports.removeNestedUndefinedValues = removeNestedUndefinedValues;
/**
 * Split the options object into ogs and got option objects
 *
 * @param {object} options - options that need to be split
 * @return {object} object with nested options for ogs and got
 *
 */
function optionSetup(ogsOptions) {
    const options = Object.assign({ onlyGetOpenGraphInfo: false }, ogsOptions);
    return { options };
}
exports.optionSetup = optionSetup;
