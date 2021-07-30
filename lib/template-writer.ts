import {CfnTemplate} from "./types";

export interface TemplateWriter {
    write(template: CfnTemplate): void;
}
