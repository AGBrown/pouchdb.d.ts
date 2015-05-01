// Type definitions for pouchdb v3.4.0
// Project: http://pouchdb.com/, https://github.com/pouchdb/pouchdb
// Definitions by: Andy Brown <https://github.com/AGBrown> (https://github.com/AGBrown/pouchdb.d.ts)
// Definitions: https://github.com/borisyankov/DefinitelyTyped
// THIS FILE:
//  This file supports the test files in this folder

/// <reference path="../../pouchdb.d.ts" />
/**
 * contains pouchdb code
 */
declare module pouchdb {
    /**
     * contains test code
     */
    module test {
        /**
         * contains integration test code
         */
        module integration {
            interface TestDoc extends pouchdb.api.methods.ExistingDoc {
                test: string;
            }
            interface NewValueDoc extends pouchdb.api.methods.NewDoc {
                value: string;
            }
            interface ValueDoc extends pouchdb.api.methods.ExistingDoc, NewValueDoc {
                value: string;
            }
        }
    }
}