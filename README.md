# cfn-appsync-include

A simple command line utlity for including local files for AppSync in the Cloudformation/SAM-Template.

Supported Resources:

- `AWS::AppSync::GraphQLSchema` Definition
- `AWS::AppSync::Resolver` Request and response mapping template
- `AWS::AppSync::Function` Request and response mapping template

## Installation
```bash
yarn add -D cfn-appsync-include
```

## Usage

```bash
node node_modules/.bin/cfn-appsync-include
```

| Option                    | Description                                       | Default           |
| ---                       | ---                                               | ---               |
| --template-file           | The cloudformation template to be used as input   | template.yaml     |
| --output-template-file    | The file name of the output file.                 | template.out.yaml |
| --resolver-templates      | Directory where the resolver template reside      | templates         |
| --debug                   | Sets the log level to debug                       | false             |
| --quiet                   | Supresses all output                              | false             |

## Example

```yaml
Resources:
  # Looks schema.graphql in the working directory
  SchemaDefault:
    Type: AWS::AppSync::GraphQLSchema
    
  SchemaOverride:
    Type: AWS::AppSync::GraphQLSchema
    Properties:
      Definition: !File my.schema.graphql
  
  # Resolvers request and response mapping templates by expected defaults
  # RequestMappingTemplate: templates/Query.test.request.vtl
  # ResponseMappingTemplate: templates/Query.test.response.vtl
  ResolverWithDefaults:
    Type: AWS::AppSync::Resolver
    Properties:
      FieldName: test
      TypeName: Query

  # RequestMappingTemplate: include file content
  # ResponseMappingTemplate: use existing inline template
  ResolverWithFileOverride:
    Type: AWS::AppSync::Resolver
    Properties:
      FieldName: test2
      TypeName: Query
      RequestMappingTemplate: !File path/to/template.vtl
      ResponseMappingTemplate: |
        $util.toJson($ctx.result)
```
