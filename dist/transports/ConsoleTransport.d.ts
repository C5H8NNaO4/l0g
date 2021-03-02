export class ConsoleTransport extends Transport {
    constructor(options: any);
}
export namespace ConsoleTransport {
    namespace logFns {
        const warning: string;
        const error: string;
        const debug: string;
        const info: string;
    }
    const surpressed: boolean;
    function surpress(): void;
    function unsurpressed(fn: any): void;
    function getOptionalArgs(options: any): any;
}
export class Table extends ConsoleTransportFeature {
    run(data: any): Table;
    log(options: any, next: any): any;
}
export class GroupFeature extends ConsoleTransportFeature {
    constructor(options: any);
    level: any;
    currentLevel: number;
    start(): GroupFeature;
    end(): GroupFeature;
    log(options: any, next: any): any;
}
import { Transport } from "./Transport";
declare class ConsoleTransportFeature extends TransportFeature {
}
declare class TransportFeature {
    register(): void;
}
export {};
//# sourceMappingURL=ConsoleTransport.d.ts.map