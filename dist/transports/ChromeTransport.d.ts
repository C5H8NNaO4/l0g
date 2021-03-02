/**
 * - Any type
 */
export type any = any;
/**
 * The return value of ConsoleTransport.prototype.transform
 */
export type ConsoleTransportTransformedOptions = any;
export type Person = {
    /**
     * - the person's age
     */
    age: number;
    /**
     * - the person's hobby
     */
    hobby: string;
};
export type Descriptor = {
    [x: string]: Person;
};
/**
 * The return value of ConsoleTransport.prototype.transform
 * @typedef {object.<object, any>} ConsoleTransportTransformedOptions
 * @property {object} console - Additional options used by ConsoleTransports
 * @property {any[]} console.args - Arguments intended to be passed to console.log
 * @property {any} * - any
 */
/**
 * @typedef Person
 * @type {Object}
 * @property {number} age - the person's age
 * @property {string} hobby - the person's hobby
 */
/**
 * @typedef {Object.<string, Person>} Descriptor
 */
/** Chrome transport class. */
export class ChromeTransport extends ConsoleTransport {
    constructor(options: any);
}
import { ConsoleTransport } from "./ConsoleTransport";
//# sourceMappingURL=ChromeTransport.d.ts.map