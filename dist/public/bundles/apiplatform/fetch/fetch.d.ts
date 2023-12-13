/// <reference types="node" />
/// <reference types="node" />
export function FetchStream(url: any, options: any): any;
export class FetchStream {
    constructor(url: any, options: any);
    url: any;
    userAgent: any;
    _redirect_count: number | undefined;
    options: any;
    responseBuffer: Buffer | undefined;
    ended: boolean | undefined;
    readyToRead: number | undefined;
    _read(size: any): void;
    drainBuffer(): void;
    destroy(ex: any): void;
    normalizeOptions(): void;
    cookieJar: any;
    parseUrl(url: any): {
        urloptions: {
            host: string | null;
            port: string | null;
            path: string;
            method: any;
            rejectUnauthorized: any;
        };
        transport: typeof https | typeof http;
    };
    setEncoding(encoding: any): void;
    runStream(url: any): void;
    _runStream(url_data: any, url: any): void;
}
export function fetchUrl(url: any, options: any, callback: any): void;
import https = require("https");
import http = require("http");
export { CookieJar };
