export function Password(str: any): {
    value: any;
    [Format]: (options: any) => any;
};
export namespace Password {
    export function hasTransport({ transport }: {
        transport: any;
    }): any;
    export function isMasked(): boolean;
    export { Format as symbol };
    export const envKeyShow: string;
}
import { Format } from "../symbols";
//# sourceMappingURL=password.d.ts.map