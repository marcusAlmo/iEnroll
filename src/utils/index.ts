/**
 * Utility module that imports and re-exports various utility functions.
 * 
 * @module utils
 * 
 * @remarks
 * This module imports utility functions from `dateUtils` and `stringUtils` modules
 * and re-exports them for easier access.
 * 
 * @example
 * ```typescript
 * import { dateUtils, stringUtils } from './utils';
 * 
 * const formattedDate = dateUtils.formatDate(new Date());
 * const capitalizedString = stringUtils.capitalize('hello world');
 * 
 * console.log(formattedDate); // Outputs formatted date
 * console.log(capitalizedString); // Outputs: 'Hello world'
 * ```
 * 
 * @packageDocumentation
 */
import * as dateUtils from "./dateUtils";
import * as stringUtils from "./stringUtils";