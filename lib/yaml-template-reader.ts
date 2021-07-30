import {CfnTemplate, Configuration} from "./types";
import * as fs from "fs";
import {load, DEFAULT_SCHEMA, Type, dump} from "js-yaml";
import chalk from "chalk";
import {TemplateReader} from "./template-reader";
import {TemplateWriter} from "./template-writer";
import {log} from "./logger";



class CustomTag {
    // @ts-ignore
    private readonly type: any;
    // @ts-ignore
    private readonly data: any;

    constructor(type: any, data: any) {
        this.type = type;
        this.data = data;
    }
}

const tags = ["scalar", "sequence", "mapping"].map(function (kind) {
    // first argument here is a prefix, so this type will handle anything starting with !
    return new Type("!", {
        kind: kind,
        multi: true,
        representName: function (object: any) {
            return object.type;
        },
        represent: function (object: any) {
            return object.data;
        },
        instanceOf: CustomTag,
        construct: function (data: any, type: any) {
            return new CustomTag(type, data);
        },
    });
});

const SCHEMA = DEFAULT_SCHEMA.extend(tags);

export class YamlTemplateReader implements TemplateReader, TemplateWriter {
    private readonly config: Configuration;

    constructor(config: Configuration) {
        this.config = config;
    }

    public read(): CfnTemplate {
        log.info(`   Reading cloudformation template from ${chalk.yellow(this.config.templateFile)}`);
        log.info("");

        let fileContent;
        try {
            fileContent = fs.readFileSync(this.config.templateFile).toString();
        } catch (e) {
            console.error(chalk.red(`[ERROR] Template file ${this.config.templateFile} does not exist.`));
            throw e;
        }

        return load(fileContent, {schema: SCHEMA});
    }

    public write(template: CfnTemplate): void {
        log.info(`   writing cloudformation template to ${chalk.yellow(this.config.outputTemplateFile)}`);
        fs.writeFileSync(this.config.outputTemplateFile, dump(template, {schema: SCHEMA}));
    }
}
