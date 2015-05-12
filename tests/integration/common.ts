// Type definitions for pouchdb v3.4.0
// Project: http://pouchdb.com/, https://github.com/pouchdb/pouchdb
// Definitions by: Andy Brown <https://github.com/AGBrown> (https://github.com/AGBrown/pouchdb.d.ts)
// Definitions: https://github.com/borisyankov/DefinitelyTyped
// THIS FILE:
//  This file supports the tests in this folder

/// <reference path="../../typings/chai/chai.d.ts" />
/// <reference path="../../typings/mocha/mocha.d.ts" />
/// <reference path="../../pouchdb.d.ts" />
/// <reference path="utils.d.ts" />
'use strict';

type BulkDocsInfo = pouchdb.api.methods.OperationResponse;
type BulkDocsError = pouchdb.api.methods.bulkDocs.BulkDocsError;

var adapters: string[] = ['http', 'local'];

var expect = chai.expect;
var should = chai.should();

interface dbsShape {
  name?: string;
}
var noop = (e, v) => { };

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
      interface BarDoc extends pouchdb.api.methods.ExistingDoc {
        bar?: string;
      }
      interface FooDoc extends pouchdb.api.methods.ExistingDoc {
        foo?: string;
      }
      interface VersionDoc extends pouchdb.api.methods.ExistingDoc {
        version: string;
      }
    }
  }
}
