
/// <reference path="pouchdb.d.ts" />

declare module pouchdb {
    module api {
        module methods {
            interface BaseDoc {
                [x: string]: any;
            }
        }
    }
}