export class Str {
    static trimAll(str: string): string {
        return str.replace(/\s+/g, '');
    }
}