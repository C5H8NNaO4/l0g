export class Color extends MapFormatter {
    constructor(fn: any, options?: {});
    colors: any;
}
export namespace Color {
    function colorByType(type: any): (v: any, formatter: any) => any;
    const formatMap: Map<(v: any) => boolean, any>;
    const strFormatMap: Map<any, any>;
    const optionsMap: Map<(v: any, k: any) => boolean, (v: any, formatter: any) => any>;
    namespace colors {
        export namespace type {
            const string: string;
            const number: string;
            const array: string;
            const object: string;
            const error: string;
        }
        export namespace key {
            const scope: string;
            const ts: string;
            namespace level {
                export const info: string;
                export const notice: string;
                export const warning: string;
                const error_1: string;
                export { error_1 as error };
                export const debug: string;
            }
        }
        export const highlight: string;
        const _default: string;
        export { _default as default };
    }
}
import { MapFormatter } from "../MapFormatter";
//# sourceMappingURL=index.d.ts.map