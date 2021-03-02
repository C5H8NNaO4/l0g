export class ReloadConfigFeature extends LoggerFeature {
    constructor(options?: {});
    file: string;
    env: boolean;
    logger: any;
    init(logger: any): void;
    scoped: any;
    reloadConfig(ev: any, fp: any): void;
}
export namespace ReloadConfigFeature {
    const symbol: symbol;
}
import { LoggerFeature } from "./Feature";
//# sourceMappingURL=ReloadConfigFeature.d.ts.map