import {CfnResource, ResourceType} from "../types";
import {TemplateResolver} from "./template-resolver";
import {ResourceHandler} from "./resource-handler";

export class InlineVtlResourceHandler<T extends ResourceType, P, K extends CfnResource<T, P>> implements ResourceHandler<T, P, K>{
    private readonly propertyResolvers: TemplateResolver<T, P, K>[]

    constructor(
        ...propertyResolvers: TemplateResolver<T, P, K>[]
    ) {
        this.propertyResolvers = propertyResolvers;
    }

    handle(resource: K) {
        for (const resolver of this.propertyResolvers) {
            resolver.resolve(resource);
        }
    }
}
