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
/// <reference path="test.basics.extra.ts" />
'use strict';

type BulkDocsInfo = pouchdb.api.methods.OperationResponse;
type BulkDocsError = pouchdb.api.methods.bulkDocs.BulkDocsError;

var adapters: string[] = ['http', 'local'];

interface dbsShape {
    name?: string;
}