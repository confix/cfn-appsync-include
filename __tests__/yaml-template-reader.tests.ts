import {YamlTemplateReader} from "../lib/yaml-template-reader";
import * as path from "path";

describe("YamlTemplateReader", () => {
   it("", () => {

       const expected = {
           Resources: {
               MyTestResource: {
                   Type: "AWS::AppSync::Resolver",
                   Properties: {
                       FieldName: "Test",
                       TypeName: "Query"
                   }
               }
           }
       }

       const reader = new YamlTemplateReader({
           templateFile: path.join("__tests__", "resources", "template.yaml"),
           outputTemplateFile: "",
           vtlDirectory: ""
       });

       const template = reader.read();

       expect(template).toEqual(expected);
   })
});
