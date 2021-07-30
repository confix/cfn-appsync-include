import {CfnResource, ResourceType} from "./types";
import {ResourceHandler} from "./resource-handler/resource-handler";

export class ResourceHandlerRegistry {

    private readonly handlerMap: {[key: string]: any} = {}

    register<TType extends ResourceType, TProps, T extends CfnResource<TType, TProps>>(type: TType, handler: ResourceHandler<TType, TProps, T>)    {
        this.handlerMap[type] = handler;
    }

    get<TType extends ResourceType, TProps, T extends CfnResource<TType, TProps>>(type: TType): ResourceHandler<TType, TProps, T> | null {
        const handler = this.handlerMap[type];

        if (!handler) {
            return null;
        }

        return handler as ResourceHandler<TType, TProps, T>;
    }
}
