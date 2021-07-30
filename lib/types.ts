export type CfnTemplate = {
    Resources: Record<string, CfnResource<ResourceType, any>>
}

export type CfnResource<TType extends ResourceType, TProps> = {
    Type: TType;
    Properties: TProps;
}

export type ResolverResourceType = "AWS::AppSync::Resolver";
export type FunctionConfigurationResourceType = "AWS::AppSync::FunctionConfiguration";
export type SchemaResourceType = "AWS::AppSync::GraphQLSchema";

export type ResourceType = ResolverResourceType | FunctionConfigurationResourceType | SchemaResourceType;


export type ResolverResource = CfnResource<"AWS::AppSync::Resolver", ResolverProperties>;
export type SchemaResource = CfnResource<"AWS::AppSync::GraphQLSchema", SchemaProperties>;
export type FunctionConfigurationResource = CfnResource<"AWS::AppSync::FunctionConfiguration", FunctionConfigurationProperties>;

export type ResolverProperties = {
    TypeName: string;
    FieldName: string;
} & MappingProperties;

export type SchemaProperties = {
    Definition?: string;
    DefinitionS3Location?: string;
}

export type FunctionConfigurationProperties = { Name: string } & MappingProperties;

export type MappingProperties = RequestMappingProperties & ResponseMappingProperties;

export type RequestMappingProperties = {
    RequestMappingTemplate?: string;
    RequestMappingTemplateS3Location?: string;
}

export type ResponseMappingProperties = {
    ResponseMappingTemplate?: string;
    ResponseMappingTemplateS3Location?: string;
}

export type Configuration = {
    templateFile: string;
    outputTemplateFile: string;
    vtlDirectory: string;
}
