export type TransportOptions = {
    /**
     * - The formatter, the transport uses.
     */
    formatter?: Formatter;
    /**
     * - The features used by the transport
     */
    features: any[];
};
/**
 * @typedef TransportOptions
 * @type {Object}
 * @property {Formatter} [formatter=new Formatter] - The formatter, the transport uses.
 * @property {Feature[]} features - The features used by the transport
 */
/**
 * Transport class
 * @description A transport is used to *transport* log messages to various locations. Like a file or the console.
 */
export class Transport {
    /**
     *
     * @param {TransportOptions} options - Optional options
     */
    constructor(options?: TransportOptions);
    formatter: Formatter;
    features: any[];
    /**
     * @description The Transport.log function gets called on behalf the Logger.
     * @param {LogOptions} options - The metadata passed to Logger.log
     */
    log(options: any): void;
    transform(options: any): any;
    send(options: any): void;
}
export namespace Transport {
    namespace symbols {
        const currentFeature: symbol;
    }
}
import { Formatter } from "../formatters";
//# sourceMappingURL=Transport.d.ts.map