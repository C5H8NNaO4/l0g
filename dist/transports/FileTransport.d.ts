/// <reference types="node" />
/// <reference types="graceful-fs" />
export class FileTransport extends Transport {
    constructor(filename: any, options?: {});
    fs: fs.WriteStream;
}
import { Transport } from "./Transport";
import fs = require("fs");
//# sourceMappingURL=FileTransport.d.ts.map