import {CfnResource, ResourceType} from "../types";
import {VtlTemplateReader} from "../vtl-template-resolver";
import {log} from "../logger";
import chalk from "chalk";

export class TemplateResolver<T extends ResourceType, P, R extends CfnResource<T, P>> {

    private readonly reader: VtlTemplateReader;
    private readonly defaultTemplateName: (r: R) => string;
    private readonly propertyName: keyof P;

    constructor(
        propertyName: keyof P,
        reader: VtlTemplateReader,
        defaultTemplateName: string | ((r: R) => string)) {
        this.propertyName = propertyName;
        this.defaultTemplateName = typeof defaultTemplateName === "string" ? () => defaultTemplateName : defaultTemplateName;
        this.reader = reader;
    }

    resolve(resource: R) {
        // todo:
        //  It would be really cool if we could support
        //  RequestMappingTemplate:
        //      Fn::Sub:
        //        - !File MyFile
        //        - Var: Value
        //

        if (!resource.Properties) {
            resource.Properties = {} as P;
        }

        const value = resource.Properties[this.propertyName];

        console.log("      " + chalk.bold(this.propertyName + ":"));
        if (!value) {
            const templateName = this.defaultTemplateName(resource);
            try {

                // @ts-ignore
                resource.Properties[this.propertyName] = this.reader.resolve(templateName);
                log.info(chalk.grey(`         ...inlining template ${chalk.green(templateName)}`));
            } catch (e) {
                log.warn(chalk.grey(`         ...the default ${chalk.red(templateName)} does not exist`));
            }
            return;
        }

        if (typeof value == "string") {
            log.info(chalk.grey(`         ...using ${chalk.green("existing")} inline template`))
            return;
        }

        // @ts-ignore
        if (typeof value == "object" && value.hasOwnProperty("type") && value["type"] === "!File") {
            const file = value["data"];

            try {
                // @ts-ignore
                resource.Properties[this.propertyName] = this.reader.resolve(file);
                log.warn(chalk.grey(`         ...inlining file ${chalk.green(file)}`));
            } catch (e) {
                log.warn(chalk.grey(`         ...the template ${chalk.red(file)} does not exist`));
            }
        }
    }
}

