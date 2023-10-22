"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const extract_1 = __importDefault(require("./extract"));
const utils_1 = require("./utils");
/**
 * sets up options for the fetch request and calls extract on html
 *
 * @param {object} options - options for ogs
 * @return {object} object with ogs results
 *
 */
async function setOptionsAndReturnOpenGraphResults(ogsOptions) {
    const { options } = (0, utils_1.optionSetup)(ogsOptions);
    if (!options.html)
        throw new Error('Must pass in `html` option.');
    const ogObject = (0, extract_1.default)(options.html, options);
    ogObject.success = true;
    return { ogObject, response: { body: options.html }, html: options.html };
}
exports.default = setOptionsAndReturnOpenGraphResults;
