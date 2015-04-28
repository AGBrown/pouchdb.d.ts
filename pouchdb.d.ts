// Type definitions for pouchdb v3.4.0
// Project: http://pouchdb.com/, https://github.com/pouchdb/pouchdb
// Definitions by: Andy Brown <https://github.com/AGBrown>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

//  Progress: up to http://pouchdb.com/api.html#fetch_document
//            in v3.4.0 test.basic.js on line 210

// Support AMD require
// Use like this: 
//      import pdb = require('pouchdb');
declare module "pouchdb" {
    export = pouchdb;
}
declare var PouchDB: pouchdb.PouchDB;

///////////////////////////////////////////////////////////////////////////////
// pouchdb module (pouchdb.js)
///////////////////////////////////////////////////////////////////////////////
/** This module enapsulates all pouchdb api objects */
declare module pouchdb {
    /**
     * Contains options used for db methods
     * @todo remote db options
     * @todo leveldb options
     */
    module options {
        /**
         * Contains options used for pouchdb constructors
         * @todo remote db options
         * @todo leveldb options
         */
        module ctor {
            /** PouchDB constructor options that can be used to create a local db */
            interface LocalDb {
                /**
                 * Specifies the adapter type: permitted values are ['idb', 'leveldb', 'websql', or 'http'].
                 * @default automatically inferred by browser (idb > websql if both supported)
                 */
                adapter?: string;
                /**
                 * Turns on auto compaction when set to true
                 * @default false
                 */
                auto_compaction?: boolean;
            }

            /** PouchDB constructor options for SQLite Plugin */
            interface SQLite {
                //  From websql.js, line 991: var db = openDB
                //  the relevant options are name, size, location, createFromLocation

                /**
                 * Specifies where to store data on iOS.
                 * Options are: 0 (Documents); 1 (Library); 2 (Library/LocalDatabase)
                 * @default 0
                 */
                location?: number;
                /**
                 * Set to 1 to put the database file in the www directory and open the database.
                 * For Android, iOS, and Amazon Fire-OS (only).
                 * @default 0
                 */
                createFromLocation?: number;
            }

            /**  PouchDB constructor options for WebSQL */
            interface WebSQL {
                /**
                 * Size in MB. 
                 * @default 5
                 */
                size?: number;
            }

            /** PouchDB constructor options when the db name is supplied via options instead of a parameter */
            interface DbName {
                /** The db name (if not supplied as a constructor argument) */
                name: string;
            }

            /** PouchDB constructor options that can be used to create a local db */
            interface LocalDbWithName extends LocalDb, DbName { }

            /**
             * PouchDB constructor options that can be used to create a local SQLite db
             * @todo is the auto_compaction option relevant to SQLite?
             */
            interface LocalSQLiteDb extends LocalDb, WebSQL, SQLite { }

            /**
             * PouchDB constructor options that can be used to create a local SQLite db
             * @todo is the auto_compaction option relevant to SQLite?
             */
            interface LocalSQLiteDbWithName extends LocalDb, WebSQL, SQLite, DbName { }

            /** PouchDB constructor options that can be used to create a local WebSQL db */
            interface LocalWebSQLDb extends LocalDb, WebSQL { }

            /** PouchDB constructor options that can be used to create a local WebSQL db */
            interface LocalWebSQLDbWithName extends LocalDb, WebSQL, DbName { }
        }

        /** empty options for use in various methods */
        interface EmptyOptions { }

        /**
         * options for use in various methods that include ajax options
         */
        interface OptionsWithAjax {
            /** The ajax options */
            ajax: AjaxOptions;
        }

        /**
         * ajax options for use in various methods
         * @todo complete the ajax property shape
         */
        interface AjaxOptions {
            /** The ajax options */
            cache?: boolean;
        }
    }
    /** 
     * Contains the standard pouchdb promises 
     * @todo what is the error shape? looks like they contain status/reason/message and id(s)?
     */
    module async {
        /** 
         * shape for the error returns 
         * @todo what (and what type) is `.error`
         */
        interface Error {
            error?: any
        }
        /** An interface to represent a promise object */
        interface Thenable<T> {
            /** A Promises/A+ `then` implementation */
            then<R>(onFulfilled?: (value: T) => Thenable<R>|R, onRejected?: (error: Error) => Thenable<R>|R): Thenable<R>;
            /** `catch` implementation as per the pouchdb example docs */
            catch<R>(onRejected: (error: Error) => Thenable<R>|R): Thenable<R>;
        }
        /** Callback alternatives to promised */
        interface Callback<T> {
            /**
             * @param error the error object
             * @param value the result value from the operation
             */
            (error: Error, value: T): void;
        }
    }

    /** Contains the main pouchDB api */
    module api {
        /** Contains methods and their call/return types */
        module methods {
            /** Promise/callback result for various methods */
            interface BaseResponse {
                /** `true` if the operation was successful; `false` otherwise */
                ok: boolean;
            }

            /** Promise/callback result for `put()`, `post()` */
            interface OperationResponse extends BaseResponse {
                /** The id of the doc operated on */
                id: string;
                /** The revision of the doc after the operation */
                rev: string;
            }

            /** Interface for an empty doc */
            interface BaseDoc { }

            /** Interface for a doc passed to the put() method */
            interface NewDoc extends BaseDoc {
                /** The id of the doc to be operated on */
                _id: string;
            }

            /** Interface for a doc passed to the put() method */
            interface ExistingDoc extends NewDoc {
                /** The revision of the doc to be operated on */
                _rev: string;
                /**
                 * indicates the deleted status of a doc
                 * @todo is this always present, or optional?
                 */
                _deleted?: boolean;
            }

            //////////////////////////// Methods //////////////////////////////
            // Please keep these modules in alphabetical order

            /** Contains the method and call/return types for close() */
            module close {
                /** Callback pattern for close() */
                interface Callback {
                    /** Closes the pouchdb */
                    close(callback?: async.Callback<string>): void;
                }
                /** Promise pattern for close() */
                interface Promise {
                    /** Closes the pouchdb */
                    close(): async.Thenable<void>;
                }
            }

            /** Contains the method and call/return types for destroy() */
            module destroy {
                /**
                 * Promise/callback result for destroy()
                 */
                interface Info extends BaseResponse { }
                /**
                 * Callback pattern for destroy
                 */
                interface Callback {
                    /**
                     * Deletes a database
                     * @param options ajax options
                     * @param callback a callback to handle success/error
                     */
                    destroy(options: options.OptionsWithAjax, callback?: async.Callback<Info>): void;
                    /**
                     * Deletes a database
                     * @param callback a callback to handle success/error
                     */
                    destroy(callback?: async.Callback<Info>): void;
                }
                /**
                 * Promise pattern for destroy
                 */
                interface Promise {
                    /**
                     * Deletes a database
                     * @param options ajax options
                     */
                    destroy(options?: options.OptionsWithAjax): async.Thenable<Info>;
                }
            }

            /** Contains the method and call/return types for get() */
            module get {
                interface Options {
                    /**
                     * Fetch specific revision of a document.
                     * @default undefined (returns winning revision)
                     */
                    rev?: string;
                    /** 
                     * Include revision history of the document 
                     * @default false
                     */
                    revs?: boolean;
                    /** 
                     * Include a list of revisions of the document, and their availability 
                     * @default false
                     */
                    revs_info?: boolean;
                    /** 
                     * Fetch all leaf revisions if `open_revs="all"` or fetch all leaf revisions 
                     * specified in `open_revs` array. 
                     * @default undefined
                     */
                    open_revs?: any; // string | string[]
                    /**
                     * If specified, conflicting leaf revisions will be attached in `_conflicts` array.
                     * @default false
                     */
                    conflicts?: boolean;
                    /**
                     * Include attachment data.
                     * @default false
                     */
                    attachments?: boolean;
                    /**
                     * Include sequence number of the revision in the database
                     * @deprecated this will be removed in the next major version
                     * @default false
                     */
                    local_seq?: boolean;
                    /** An object of options to be sent to the ajax requester */
                    ajax?: options.AjaxOptions;
                }
                interface Response extends ExistingDoc {
                    _conflicts?: any; // some kind of []
                }
                /**
                 * Callback pattern for remove
                 * @todo: overload resolution if options not specified. Callback value type becomes any
                 *          (see test.basics.ts "modify a doc" - requires `info: OperationResponse`
                 */
                interface Callback {
                    /**
                      * Retrieves a document, specified by `docId`.
                      * @param docId the doc id
                      * @param options
                      */
                    get<R>(docId: string, options?: Options, callback?: async.Callback<R>): void;
                }
                /** Promise pattern for remove */
                interface Promise {
                    /**
                      * Retrieves a document, specified by `docId`.
                      * @param docId the doc id
                      * @param options
                      */
                    get<R>(docId: string, options?: Options): async.Thenable<R>;
                }
            }

            /** Contains the method and call/return types for id() */
            module id {
                /** Callback pattern for id() */
                interface Callback {
                    /** Returns the instance id for the pouchdb */
                    id(callback?: async.Callback<string>): void;
                }
                /** Promise pattern for id() */
                interface Promise {
                    /** Returns the instance id for the pouchdb */
                    id(): async.Thenable<string>;
                }
            }
            
            /** Contains the method and call/return types for post() */
            module post {
                /**
                 * Callback pattern for post
                 * @todo: overload resolution if options not specified. Callback value type becomes any
                 *          (see test.basics.ts "modify a doc" - requires `info: OperationResponse`
                 */
                interface Callback {
                    /**
                     * Create a new document and let PouchDB auto-generate an _id for it.
                     * @param doc the doc (with no id)
                     * @param options ajax options
                     * @todo define options shape - docs don't make it clear what this is
                     */
                    post(doc: BaseDoc, options?: options.EmptyOptions, callback?: async.Callback<OperationResponse>): void;
                }
                /** Promise pattern for post */
                interface Promise {
                    /**
                     * Create a new document and let PouchDB auto-generate an _id for it.
                     * @param doc the doc (with no id)
                     * @param options ajax options
                     * @todo define options shape - docs don't make it clear what this is
                     */
                    post(doc: BaseDoc, options?: options.EmptyOptions): async.Thenable<OperationResponse>;
                }
            }
            
            /** Contains the method and call/return types for put() */
            module put {
                /**
                 * Callback pattern for put
                 * @todo: overload resolution if options not specified. Callback value type becomes any
                 *          (see test.basics.ts "modify a doc" - requires `info: OperationResponse`
                 */
                interface Callback {
                    /**
                     * Update an existing document.
                     * @param doc the doc
                     * @param options
                     * @todo define options shape - docs don't make it clear what this is
                     */
                    put(doc: ExistingDoc, options?: options.EmptyOptions, callback?: async.Callback<OperationResponse>): void;
                    /**
                     * Create a new document.
                     * @param doc the doc
                     * @param options
                     * @todo define options shape - docs don't make it clear what this is
                     */
                    put(doc: NewDoc, options?: options.EmptyOptions, callback?: async.Callback<OperationResponse>): void;
                    /**
                     * Update an existing document. 
                     * @param doc the doc
                     * @param docId the doc id
                     * @param docRev the doc rev
                     * @param options
                     * @todo define options shape - docs don't make it clear what this is
                     */
                    put(doc: BaseDoc, docId: string, docRev: string, options?: options.EmptyOptions, callback?: async.Callback<OperationResponse>): void;
                    /**
                     * Create a new document. If the document already exists, 
                     * you must use the update overload otherwise a conflict will occur.
                     * @param doc the doc
                     * @param docId the doc id
                     * @param options
                     * @todo define options shape - docs don't make it clear what this is
                     */
                    put(doc: BaseDoc, docId: string, options?: options.EmptyOptions, callback?: async.Callback<OperationResponse>): void;
                }
                /** Promise pattern for put */
                interface Promise {
                    /**
                     * Update an existing document.
                     * @param doc the doc
                     * @param options
                     * @todo define options shape - docs don't make it clear what this is
                     */
                    put(doc: ExistingDoc, options?: options.EmptyOptions): async.Thenable<OperationResponse>;
                    /**
                     * Create a new document.
                     * @param doc the doc
                     * @param options
                     * @todo define options shape - docs don't make it clear what this is
                     */
                    put(doc: NewDoc, options?: options.EmptyOptions): async.Thenable<OperationResponse>;
                    /**
                     * Update an existing document.
                     * @param doc the doc
                     * @param docId the doc id
                     * @param docRev the doc rev
                     * @param options
                     * @todo define options shape - docs don't make it clear what this is
                     */
                    put(doc: BaseDoc, docId: string, docRev: string, options?: options.EmptyOptions): async.Thenable<OperationResponse>;
                    /**
                     * Create a new document. If the document already exists, 
                     * you must use the update overload otherwise a conflict will occur.
                     * @param doc the doc
                     * @param docId the doc id
                     * @param options
                     * @todo define options shape - docs don't make it clear what this is
                     */
                    put(doc: BaseDoc, docId: string, options?: options.EmptyOptions): async.Thenable<OperationResponse>;
                }
            }
            
            /** Contains the method and call/return types for remove() */
            module remove {
                /**
                 * Callback pattern for remove
                 * @todo: overload resolution if options not specified. Callback value type becomes any
                 *          (see test.basics.ts "modify a doc" - requires `info: OperationResponse`
                 * @todo: do the callbacks return the doc, or just the OperationResponse?
                 */
                interface Callback {
                   /**
                     * Deletes the document. 
                     * `doc` is required to be a document with at least an `_id` and a `_rev` property. 
                     * Sending the full document will work as well.
                     * @param docId the doc id
                     * @param docRev the doc revision
                     * @param options
                     * @todo define options shape - docs don't make it clear what this is
                     */
                    remove(docId: string, docRev: string, options?: options.EmptyOptions, callback?: async.Callback<OperationResponse>): void;
                    /**
                     * Deletes the document. 
                     * `doc` is required to be a document with at least an `_id` and a `_rev` property. 
                     * Sending the full document will work as well.
                     * @param doc the doc
                     * @param options
                     * @todo define options shape - docs don't make it clear what this is
                     */
                    remove(doc: ExistingDoc, options?: options.EmptyOptions, callback?: async.Callback<OperationResponse>): void;
                 }
                /** Promise pattern for remove */
                interface Promise {
                    /**
                     * Deletes the document. 
                     * `doc` is required to be a document with at least an `_id` and a `_rev` property. 
                     * Sending the full document will work as well.
                     * @param docId the doc id
                     * @param docRev the doc revision
                     * @param options
                     * @todo define options shape - docs don't make it clear what this is
                     */
                    remove(docId: string, docRev: string, options?: options.EmptyOptions): async.Thenable<OperationResponse>;
                    /**
                     * Deletes the document. 
                     * `doc` is required to be a document with at least an `_id` and a `_rev` property. 
                     * Sending the full document will work as well.
                     * @param doc the doc
                     * @param options
                     * @todo define options shape - docs don't make it clear what this is
                     */
                    remove(doc: ExistingDoc, options?: options.EmptyOptions): async.Thenable<OperationResponse>;
                }
            }
        }
        /** Contains the main callback/promise apis for pouchdb */
        module db {
            /** pouchDB api: callback based */
            interface Callback extends
                Properties
                , methods.destroy.Callback
                , methods.close.Callback
                , methods.get.Callback
                , methods.id.Callback
                , methods.post.Callback
                , methods.put.Callback
                , methods.remove.Callback
            {}
            /** pouchDB api: promise based */
            interface Promise extends
                Properties
                , methods.destroy.Promise
                , methods.close.Promise
                , methods.get.Promise
                , methods.id.Promise
                , methods.post.Promise
                , methods.put.Promise
                , methods.remove.Promise
            {}
        }
        /** The main pouchDB interface properties */
        interface Properties {
            /** The adapter being used by this db instance */
            adapter: string;
        }
    }
    /** The api module for the pouchdb callback pattern */
    module callback {
        /** The main pouchDB interface (callback pattern) */
        interface PouchDB extends api.db.Callback { }
    }
    /** The api module for the pouchdb promise pattern */
    module promise {
        /** The main pouchDB interface (promise pattern) */
        interface PouchDB extends api.db.Promise { }
    }
    /** The api module for the pouchdb promise pattern (constructor only) */
    module thenable {
        /**
         * Special case class returned by the constructors of the promise api pouchDB.
         * Usually only a `pouchdb.promise.PouchDB` reference would be kept, assigned by
         * the `then` of the constructor.
         */
        interface PouchDB extends promise.PouchDB, async.Thenable<promise.PouchDB> { }
    }
    /**
     * The main pouchDB entry point. The constructors here will return either a 
     * Callback or Promise pattern api.
     */
    export interface PouchDB {
        //////////////////////////////  local db  /////////////////////////////
        /**
         * Creates a new local pouchDb with the name specified and 
         * all the default options
         * @param name the database name
         * @returns a Thenable<PouchDB>
         */
        new (name: string): thenable.PouchDB;
        /**
         * Creates a new local pouchDb with the name specified and 
         * all the default options
         * @param name the database name
         * @param callback a callback to handle success/error
         * @returns a new PouchDB
         */
        new (name: string, callback?: async.Callback<callback.PouchDB>): callback.PouchDB;
        
        // note: overload ordering is for ts overload selection
        ///////////////////////////  local sqlite db  /////////////////////////
        /**
         * Creates a new local SQLite pouchDb with the name and options provided
         * @param name the database name
         * @param options the SQlite database options
         * @returns a Thenable<PouchDB>
         */
        new (name: string, options: options.ctor.LocalSQLiteDb): thenable.PouchDB;
        /**
         * Creates a new local SQLite pouchDb with the name and options provided
         * @param name the database name
         * @param options the SQlite database options
         * @param callback a callback to handle success/error
         * @returns a new PouchDB
         */
        new (name: string, options: options.ctor.LocalSQLiteDb, callback: async.Callback<callback.PouchDB>): callback.PouchDB;

        /**
         * Creates a new local SQLite pouchDb with the options provided
         * @param options the SQlite database options, including the name
         * @returns a Thenable<PouchDB>
         */
        new (options: options.ctor.LocalSQLiteDbWithName): thenable.PouchDB;
        /**
         * Creates a new local SQLite pouchDb with the options provided
         * @param options the SQlite database options, including the name
         * @param callback a callback to handle success/error
         * @returns a new PouchDB
         */
        new (options: options.ctor.LocalSQLiteDbWithName, callback: async.Callback<callback.PouchDB>): callback.PouchDB;
        
        /////////////////////////// local websql db ///////////////////////////
        /**
         * Creates a new local WebSQL pouchDb with the name and options provided
         * @param name A string value that specifies the database name
         * @param options An object that specifies the local database options
         * @returns a Thenable<PouchDB>
         */
        new (name: string, options: options.ctor.LocalWebSQLDb): thenable.PouchDB;
        /**
         * Creates a new local WebSQL pouchDb with the name and options provided
         * @param name A string value that specifies the database name
         * @param options An object that specifies the local database options
         * @param callback a callback to handle success/error
         * @returns a new PouchDB
         */
        new (name: string, options: options.ctor.LocalWebSQLDb, callback: async.Callback<callback.PouchDB>): callback.PouchDB;

        /**
         * Creates a new local WebSQL pouchDb with the options provided
         * @param options An object that specifies the local database options
         * @returns a Thenable<PouchDB>
         */
        new (options: options.ctor.LocalWebSQLDbWithName): thenable.PouchDB;
        /**
         * Creates a new local WebSQL pouchDb with the options provided
         * @param options An object that specifies the local database options
         * @param callback a callback to handle success/error
         * @returns a new PouchDB
         */
        new (options: options.ctor.LocalWebSQLDbWithName, callback: async.Callback<callback.PouchDB>): callback.PouchDB;
        
        //////////////////////////////  local db  /////////////////////////////
        /**
         * Creates a new local pouchDb with the name and options provided
         * @param name the database name
         * @param options the local database options
         * @returns a Thenable<PouchDB>
         */
        new (name: string, options: options.ctor.LocalDb): thenable.PouchDB;
        /**
         * Creates a new local pouchDb with the name and options provided
         * @param name the database name
         * @param options the local database options
         * @param callback a callback to handle success/error
         * @returns a new PouchDB
         */
        new (name: string, options: options.ctor.LocalDb, callback: async.Callback<callback.PouchDB>): callback.PouchDB;

        /**
         * Creates a new local pouchDb with the options provided
         * @param options the local database options, including the name
         * @returns a Thenable<PouchDB>
         */
        new (options: options.ctor.LocalDbWithName): thenable.PouchDB;
        /**
         * Creates a new local pouchDb with the options provided
         * @param options the local database options, including the name
         * @param callback a callback to handle success/error
         * @returns a new PouchDB
         */
        new (options: options.ctor.LocalDbWithName, callback: async.Callback<callback.PouchDB>): callback.PouchDB;
        
        //  And finally do an "any" overload so we don't restrict any options not done yet
        /**
         * A fallback constructor if none of the typed constructors cover a use case
         * @todo if you find yourself using this, consider contributing a patch
         * to add/improve the necessary typed overload instead of `options: any`
         */
        new (name: string, options: any): thenable.PouchDB;
        /**
         * A fallback constructor if none of the typed constructors cover a use case
         * @todo if you find yourself using this, consider contributing a patch
         * to add/improve the necessary typed overload instead of `options: pouchdb.options.DbName`
         */
        new (options: options.ctor.DbName): thenable.PouchDB;
    }
}
