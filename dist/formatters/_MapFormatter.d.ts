export class MapFormatter extends Formatter {
    static isObject: (v: any) => boolean;
    static isError: (v: any) => boolean;
    static isString: (v: any) => boolean;
    static compose: (...fns: any[]) => (v: any) => any;
    constructor(fn: any, options?: {});
    formatMap: any;
    strFormatMap: any;
    optionsMap: any;
    transformOptions(options: any): any;
}
export function oftype(t: any): (v: any) => boolean;
export function key(key: any): (v: any, k: any) => boolean;
export function ofinstance(t: any): (v: any) => boolean;
import { Formatter } from "./Formatter";
//# sourceMappingURL=_MapFormatter.d.ts.map