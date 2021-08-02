import {TemplateProcessor} from "../lib/template-processor";
import {CfnTemplate} from "../lib/types";
import {ResourceHandlerRegistry} from "../lib/resource-handler-registry";
import {log, LogLevel} from "../lib/logger";

log.setLevel(LogLevel.OFF);

const read = jest.fn();

const reader = {
    read
}

const write = jest.fn();

const writer = {
    write
}

describe("Template Processor", () => {
    it("does something", () => {
        const template: CfnTemplate = {
            Resources: {
                Resolver: {
                    Type: "AWS::AppSync::Resolver",
                    Properties: {
                        RequestMappingTemplate: "request exists",
                        ResponseMappingTemplate: "response exists",
                    }
                }
            }
        }

        const expected = JSON.parse(JSON.stringify(template));

        read.mockReturnValueOnce(template);

        const proc = new TemplateProcessor(reader, writer, new ResourceHandlerRegistry())

        proc.run();

        expect(template).toEqual(expected);
    })
});

