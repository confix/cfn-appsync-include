import {
    CfnResource,
    ResourceType
} from "../types";

export interface ResourceHandler<TType extends ResourceType, TProps, T extends CfnResource<TType, TProps>> {
    handle(resource: T): void
}


