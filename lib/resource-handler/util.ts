const INCLUDE_EXPR = /^!File .+$/

export function isFileInclude(value: string): boolean {
    return INCLUDE_EXPR.test(value);
}

export function getFilePath(value: string): string {
    return value.substr("!File ".length);
}
