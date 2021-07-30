#!/use/bin/env node

import {
    Configuration,
    FunctionConfigurationProperties,
    FunctionConfigurationResource,
    ResolverProperties,
    ResolverResource,
    SchemaProperties,
    SchemaResource
} from "../lib/types";
import {TemplateProcessor} from "../lib/template-processor";
import {YamlTemplateReader} from "../lib/yaml-template-reader";
import {ResourceHandlerRegistry} from "../lib/resource-handler-registry";
import * as path from "path";
import {DefaultVtlTemplateReader} from "../lib/vtl-template-resolver";
import {InlineVtlResourceHandler} from "../lib/resource-handler/resource-property-template-resolver";
import {TemplateResolver} from "../lib/resource-handler/template-resolver";
import {log, LogLevel} from "../lib/logger";

const {program} = require("commander");

program.version("0.0.1")
    .option("--template-file <templateFile>", "the input template", "template.yaml")
    .option("--output-template-file <outputTemplateFile>", "the output template", "template.out.yaml")
    .option("--resolver-templates <resolverTemplates>", "the resolver mapping template directory", "templates")
    .option("--debug", "Sets log level to debug", false)
    .option("--quiet", "Disables all logs", false)
program.parse(process.argv);

const {
    templateFile,
    outputTemplateFile,
    resolverTemplates,
    debug,
    quiet
} = program.opts();

if (debug) {
    log.setLevel(LogLevel.Debug);
}

if (quiet) {
    log.setLevel(LogLevel.Error)
}

const config: Configuration = {
    templateFile,
    outputTemplateFile,
    vtlDirectory: resolverTemplates
}

const reg = new ResourceHandlerRegistry();

const mappingTemplateReader = new DefaultVtlTemplateReader(path.join(process.cwd(), config.vtlDirectory));

const schemaDefinitionResolver = new InlineVtlResourceHandler<"AWS::AppSync::GraphQLSchema", SchemaProperties, SchemaResource>(
    new TemplateResolver<"AWS::AppSync::GraphQLSchema", SchemaProperties, SchemaResource>("Definition",
        new DefaultVtlTemplateReader(process.cwd()), "schema.graphql")
);

const resolverTemplateResolver = new InlineVtlResourceHandler<"AWS::AppSync::Resolver", ResolverProperties, ResolverResource>(
    new TemplateResolver<"AWS::AppSync::Resolver", ResolverProperties, ResolverResource>("RequestMappingTemplate",
        mappingTemplateReader, r => `${r.Properties.TypeName}.${r.Properties.FieldName}.request.vtl`),
    new TemplateResolver<"AWS::AppSync::Resolver", ResolverProperties, ResolverResource>("ResponseMappingTemplate",
        mappingTemplateReader, r => `${r.Properties.TypeName}.${r.Properties.FieldName}.response.vtl`)
)

const functionConfigTemplateResolver = new InlineVtlResourceHandler<"AWS::AppSync::FunctionConfiguration", FunctionConfigurationProperties, FunctionConfigurationResource>(
    new TemplateResolver<"AWS::AppSync::FunctionConfiguration", FunctionConfigurationProperties, FunctionConfigurationResource>(
        "RequestMappingTemplate", mappingTemplateReader, r => `${r.Properties.Name}.request.vtl`
    ),
    new TemplateResolver<"AWS::AppSync::FunctionConfiguration", FunctionConfigurationProperties, FunctionConfigurationResource>(
        "ResponseMappingTemplate", mappingTemplateReader, r => `${r.Properties.Name}.response.vtl`
    ),
)

reg.register("AWS::AppSync::GraphQLSchema", schemaDefinitionResolver);
reg.register("AWS::AppSync::Resolver", resolverTemplateResolver);
reg.register("AWS::AppSync::FunctionConfiguration", functionConfigTemplateResolver);

const readWriter = new YamlTemplateReader(config);
const processor = new TemplateProcessor(readWriter, readWriter, reg);

processor.run();
