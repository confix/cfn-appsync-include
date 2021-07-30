import {CfnTemplate} from "./types";

export interface TemplateReader {
    read(): CfnTemplate;
}
