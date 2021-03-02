export class MapFormatter extends Formatter {
    constructor(fn: any, options?: {});
    formatMap: any;
    strFormatMap: any;
    optionsMap: any;
    transformOptions(options: any): any;
}
export namespace MapFormatter {
    function isObject(v: any): boolean;
    function isError(v: any): boolean;
    function isString(v: any): boolean;
    const isArray: (arg: any) => arg is any[];
    function compose(...fns: any[]): (v: any) => any;
}
export function oftype(t: any): (v: any) => boolean;
export function key(key: any): (v: any, k: any) => boolean;
export function ofinstance(t: any): (v: any) => boolean;
import { Formatter } from "../Formatter";
//# sourceMappingURL=index.d.ts.map