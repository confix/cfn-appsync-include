import * as fs from "fs";
import * as path from "path";

export interface VtlTemplateReader {
    resolve(name: string): string;
}

export class DefaultVtlTemplateReader implements VtlTemplateReader {
    private readonly basePath: string;

    constructor(basePath: string) {
        this.basePath = basePath;
    }

    resolve(name: string): string {
        return fs.readFileSync(path.join(this.basePath, name)).toString("utf-8");
    }
}

