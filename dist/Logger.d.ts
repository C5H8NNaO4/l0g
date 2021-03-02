export type LogLevelSet = "npm" | "rfc5424";
export type LoggerOptions = {
    /**
     * - An array of transports
     */
    transports: Transport[];
    /**
     * - The level set
     */
    levels?: LogLevelSet;
};
/**
 * The options that you can pass to a log message.
 */
export type MessageOptions = {};
/**
 * @typedef {"npm" | "rfc5424"} LogLevelSet
 * @type {string}
 */
/**
 * @typedef LoggerOptions
 * @type {Object}
 * @property {Transport[]} transports - An array of transports
 * @property {LogLevelSet} [levels="rfc5424"] - The level set
 */
/**
 * The options that you can pass to a log message.
 * @typedef MessageOptions
 * @type {Object}
 */
/**
 * @description Logger class
 * @type {Logger}
 * @property {string} level - Static
 */
export class Logger {
    /**
     * Logger constructor
     * @param {String} level - The desired log level for the logger.
     * @param {LoggerOptions} [options=Logger.defaults.options] - Optional options.
     */
    constructor(level?: string, options?: LoggerOptions);
    /**
     * The log level of the logger.
     * @type {string}
     */
    level: any;
    /**
     * The log level set used by the logger. See l0g/levels/*
     * @type {Object}
     *
     */
    levels: any;
    gather: any;
    transports: any;
    features: any;
    scopes: any;
    extra: any;
    options: any;
    context: any;
    meta: any;
    addTransport(transport: any): void;
    setMessageLevel(level: any): Logger;
    setNextLevel(level: any): Logger;
    setLevel(level: any): Logger;
    /**
     *
     * @param {*} level
     * @param  {...any} args
     */
    log(message: any, ...args: any[]): void;
    /**
     * Returns a new Logger instance with the key set as its scope.
     * @param {string} key - The handle of the scope.
     */
    scope(key: string): any;
    [Symbol.toStringTag]: any;
}
export namespace Logger {
    export const filter: any;
    /**
     * Returns a new Logger instance with the key set as its scope.
     * @param {string} key - The handle of the scope.
     */
    export function scope(key: string): any;
    export function write(...msg: any[]): void;
    export { levels };
    export namespace defaults {
        const level: string;
        namespace options {
            const levels_1: string;
            export { levels_1 as levels };
        }
    }
}
import levels = require("./levels");
//# sourceMappingURL=Logger.d.ts.map