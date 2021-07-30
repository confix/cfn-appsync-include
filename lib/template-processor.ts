import {TemplateReader} from "./template-reader";
import {ResourceHandlerRegistry} from "./resource-handler-registry";
import {TemplateWriter} from "./template-writer";
import {log} from "./logger";
import chalk from "chalk";

export class TemplateProcessor {
    private readonly reader: TemplateReader;
    private readonly handlerRegistry: ResourceHandlerRegistry;
    private readonly writer: TemplateWriter;

    constructor(reader: TemplateReader, writer: TemplateWriter, handlerRegistry: ResourceHandlerRegistry) {
        this.reader = reader;
        this.writer = writer;
        this.handlerRegistry = handlerRegistry;
    }

    public run = () => {
        log.info(chalk.grey("==============================================================="));
        log.info(chalk.bold(" Processing cloudformation template"));
        log.info(chalk.grey("==============================================================="));
        log.info("");

        const template = this.reader.read();

        log.debug("Parsed schema is:")
        log.debug(JSON.stringify(template, null, 2));

        for (const [logicalId, resource] of Object.entries(template.Resources)) {

            const handler = this.handlerRegistry.get(resource.Type);

            if (!handler) {
                log.debug(`No handler for resource ${logicalId} of type ${resource.Type} registered`);
                continue;
            }

            log.info(`  Handling resource ${chalk.yellow(logicalId)}:`)

            handler.handle(resource);
        }

        log.info("");

        this.writer.write(template);
    }
}
