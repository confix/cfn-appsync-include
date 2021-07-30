declare module "js-yaml" {
    const DEFAULT_SCHEMA: any;

    function load(content: string, config: any): any;

    class Type {
        constructor(x: any, y: any)
    }


    function dump(schema: any, config: any): string;
}


