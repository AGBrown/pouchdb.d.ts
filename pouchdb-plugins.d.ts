
/// <reference path="pouchdb.d.ts" />

declare module pouchdb {
    module options {
        module ctor {
            /** PouchDB constructor options that can be used on custom plugins and adapters */
            interface CustomDb {
                /**
                 * Enables custom options to be passed to plugins or adapters
                 */
                [x: string]: any;
            }
        }
    }
}