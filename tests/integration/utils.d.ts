// Type definitions for pouchdb v3.4.0
// Project: http://pouchdb.com/, https://github.com/pouchdb/pouchdb
// Definitions by: Andy Brown <https://github.com/AGBrown> (https://github.com/AGBrown/pouchdb.d.ts)
// Definitions: https://github.com/borisyankov/DefinitelyTyped
// THIS FILE:
//  This file defines the shape of the test utilities in
//    pouchdb/tests/integration/util.js

/**
 * Helpful test utilities
 */
declare var testUtils: pouchdb.test.integration.TestUtils;

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
      /**
       * Helpful test utilities
       */
      interface TestUtils {
        isCouchMaster(): boolean;
        /**
         * Delete specified databases
         */
        cleanup(dbs: string[], done: () => void): void;
        /**
         * Prefix http adapter database names with their host and
         * node adapter ones with a db location
         */
        adapterUrl(adapter: string, name: string): string;

        isCouchDB<R>(callback: (isCouchDB: boolean) => R): R;
      }
    }
  }
}
