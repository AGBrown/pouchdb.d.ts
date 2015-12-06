// Type definitions for pouchdb v3.4.0
// Project: http://pouchdb.com/, https://github.com/pouchdb/pouchdb
// Definitions by: Andy Brown <https://github.com/AGBrown> (https://github.com/AGBrown/pouchdb.d.ts), Frederico Galvão <https://github.com/fredgalvao>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

//  Progress: up to http://pouchdb.com/api.html#fetch_document
//            in v3.4.0 test.basic.js on line 210

// Support AMD require
// Use like this:
//      import pdb = require('pouchdb');
declare module "pouchdb" {
    export = pouchdb;
}
/** The PouchDB type */
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
            /** PouchDB constructor options that can be used on custom plugins and adapters */
            interface CustomDb {
            }
            /** PouchDB constructor options that can be used to create a local db */
            interface LocalDb extends CustomDb {
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
            interface SQLite extends CustomDb {
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
            interface WebSQL extends CustomDb {
                /**
                 * Size in MB.
                 * @default 5
                 */
                size?: number;
            }

            /** PouchDB constructor options when the db name is supplied via options instead of a parameter */
            interface DbName extends CustomDb {
                /** The db name (if not supplied as a constructor argument) */
                name: string;
            }

            /** PouchDB constructor options that can be used to create a local db */
            interface LocalDbWithName extends LocalDb, DbName, CustomDb { }

            /**
             * PouchDB constructor options that can be used to create a local SQLite db
             * @todo is the auto_compaction option relevant to SQLite?
             */
            interface LocalSQLiteDb extends LocalDb, WebSQL, SQLite, CustomDb { }

            /**
             * PouchDB constructor options that can be used to create a local SQLite db
             * @todo is the auto_compaction option relevant to SQLite?
             */
            interface LocalSQLiteDbWithName extends LocalDb, WebSQL, SQLite, DbName, CustomDb { }

            /** PouchDB constructor options that can be used to create a local WebSQL db */
            interface LocalWebSQLDb extends LocalDb, WebSQL, CustomDb { }

            /** PouchDB constructor options that can be used to create a local WebSQL db */
            interface LocalWebSQLDbWithName extends LocalDb, WebSQL, DbName, CustomDb { }
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
     * Contains the standard pouchdb promise utilities
     * @todo what is the error shape? looks like they contain status/reason/message and id(s)?
     */
    module async {
        /**
         * shape for the error returns
         * @todo what (and what type) is `.error`. Is `.message` always there, or should this
         * be a union type with StandardError
         */
        interface Error {
            error?: any;
            message?: string;
            status?: number;
            name?: string;
            reason?: string;
        }
        /** Overrides a supplied interface to represent a promise object with custom error typings for the first pass */
        export interface PouchPromise<T> extends Promise<T> {
            /** A Promises/A+ `then` implementation */
            then<R>(onFulfilled?: (value: T) => Promise<R> | R, onRejected?: (error: pouchdb.async.Error) => Promise<R> | R): Promise<R>;
            then<R>(onFulfilled?: (value: T) => Promise<R> | R, onRejected?: (error: pouchdb.async.Error) => void): Promise<R>;
            /** `catch` implementation as per the pouchdb example docs */
            catch<R>(onRejected?: (error: pouchdb.async.Error) => Promise<R> | R): Promise<R>;
            catch<R>(onRejected?: (error: pouchdb.async.Error) => void): Promise<R>;
        }
        /** Callback alternatives to promises */
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
            //////////////////////////// Responses /////////////////////////////
            /** Promise/callback result for various methods */
            interface BaseResponse {
                /** `true` if the operation was successful; `false` otherwise */
                ok: boolean;
            }

            /** Promise/callback result for various methods. Note that documents use `_id`
             * and responses provide `id`.
             */
            interface OperationResponse extends BaseResponse {
                /** The id of the doc operated on */
                id: string;
                /** The revision of the doc after the operation */
                rev: string;
            }

            //////////////////////////// Doc Shapes ////////////////////////////
            /** Interface for an empty doc.
             * @todo see https://github.com/Microsoft/TypeScript/issues/1809:
             * cannot yet specify docs are objects, and not primitives, so use this type as a placeholder.
             */
            interface BaseDoc {
            }

            /** Interface for a doc (with `_id`) passed to the put() method */
            interface NewDoc extends BaseDoc {
                /** The id of the doc to be operated on */
                _id: string;
            }

            /** Interface for a doc (with `_id`, `_rev`, `_deleted`) passed to
             *    the `put()` and `bulkDocs()` method */
            interface ExistingDoc extends NewDoc {
                /** The revision of the doc to be operated on */
                _rev: string;
                /**
                 * indicates the deleted status of a doc
                 * @todo is this always present, or optional?
                 * @default: false
                 */
                _deleted?: boolean;
            }

            /** A doc with special replication fields */
            interface ReplicationDoc extends NewDoc {
                _replication_id: string;
                _replication_state: string;
                _replication_state_time: number;
                _replication_stats: {}
            }

            /** Options for `changes()` and `allDocs()` output */
            interface BasePaginationOptions {
                /**
                 * Include the associated document in each row in the `doc` field
                 * @see conflicts
                 * @see attachments
                 * @default `false`
                 */
                include_docs?: boolean;
                /**
                 * Include conflict information in the `_conflicts` field (see {@linkcode #include_docs})
                 * @see include_docs
                 * @see attachments
                 * @default `false`
                 */
                conflicts?: boolean;
                /**
                 * Include attachment data as base64-encoded string. (see {@linkcode #include_docs})
                 * @see include_docs
                 * @see conflicts
                 * @default `false`
                 */
                attachments?: boolean;
                /**
                 * Reverse the order of the output documents
                 * @default `false`
                 */
                descending?: boolean;
                /**
                 * Maximum number of documents to return.
                 * @default undefined
                 */
                limit?: number;
            }

            /** A stored document returned for `allDocs` and `query()` */
            interface StoredDoc extends ExistingDoc {
                /** The document attachments */
                _attachments?: {};
            }

            /** A container for a document as returned by `allDocs()` and `query()` */
            interface DocContainer<D extends ExistingDoc> {
                /** The document */
                doc: D;
                /** The document id */
                id: string;
                /** The document key */
                key: string;
                /** @todo not sure what this is */
                value: {
                    rev: string;
                    deleted?: boolean;
                }

                    /**| {
                    _rev: string;
                    deleted?: boolean;
                    sum?:number;
                    count?: number;
                    min?: number;
                    max?: number;
                    sumsqr?: number;
                }*/
            }

            /** Response object for `allDocs()` and `query()` */
            interface Response {
                /** The `skip` if provided, or in CouchDB the actual offset */
                offset: number;
                /** the total number of non-deleted documents in the database */
                total_rows: number;
                /** rows containing the documents, or just the `_id`/`_revs` if you didn't
                 *  set `include_docs` to `true`
                 */
                rows: DocContainer<StoredDoc>[];
            }

            //////////////////////////// Methods ///////////////////////////////
            // Please keep these modules in alphabetical order

            /** Contains the method and call/return types for allDocs() */
            module allDocs {

                /** Options for `allDocs()` output */
                interface RangeOptions extends BasePaginationOptions {
                    /**
                     * Get documents with IDs in a certain range from this to {@linkcode #endkey}
                     * (inclusive/see {@linkcode #inclusive_end}).
                     */
                    startkey?: string;
                    /**
                     * Get documents with IDs in a certain range from {@linkcode #startkey} to this
                     * (inclusive/see {@linkcode #inclusive_end}).
                     */
                    endkey?: string;
                    /**
                     * Include documents having an ID equal to the given {@linkcode #endkey}
                     * @default false
                     */
                    inclusive_end?: boolean;

                    /**
                     * Number of docs to skip before returning (warning: poor performance on IndexedDB/LevelDB!).
                     */
                    skip?: number
                }

                /** Options for `allDocs()` output */
                interface PaginationOptions extends BasePaginationOptions {
                    /**
                     * Number of docs to skip before returning (warning: poor performance on IndexedDB/LevelDB!).
                     */
                    skip?: number
                }

                /** Options for `allDocs()` output */
                interface FilterOptions extends BasePaginationOptions {
                    /** Only return documents with IDs matching this string key. */
                    key?: string;
                    /** Array of string keys to fetch in a single shot. */
                    keys?: string[];
                }

                /** Callback pattern for allDocs() */
                interface Callback {
                    /** Fetch multiple documents, indexed and sorted by the `_id`. */
                    allDocs(callback?: async.Callback<Response>): void;
                    /** Fetch multiple documents, indexed and sorted by the `_id`. */
                    allDocs(options: RangeOptions, callback?: async.Callback<Response>): void;
                    /** Fetch multiple documents, indexed and sorted by the `_id`. */
                    allDocs(options: PaginationOptions, callback?: async.Callback<Response>): void;
                    /** Fetch multiple documents, indexed and sorted by the `_id`. */
                    allDocs(options: FilterOptions, callback?: async.Callback<Response>): void;
                }
                /** Promise pattern for allDocs() */
                interface Promisable {
                    /** Fetch multiple documents, indexed and sorted by the `_id`. */
                    allDocs(): async.PouchPromise<Response>;
                    /** Fetch multiple documents, indexed and sorted by the `_id`. */
                    allDocs(options: RangeOptions): async.PouchPromise<Response>;
                    /** Fetch multiple documents, indexed and sorted by the `_id`. */
                    allDocs(options: PaginationOptions): async.PouchPromise<Response>;
                    /** Fetch multiple documents, indexed and sorted by the `_id`. */
                    allDocs(options: FilterOptions): async.PouchPromise<Response>;
                }
            }

            /** Contains the method and call/return types for bulkDocs() */
            module bulkDocs {
                /** Interface for a bulk update array member (with `_id?`, `_rev?`, `_deleted?`)
                 *    passed to the bulkDocs() method */
                interface MixedDoc {
                    /** The id of the doc to be operated on */
                    _id?: string;
                    /** The revision of the doc to be operated on */
                    _rev?: string;
                    /**
                     * indicates the deleted status of a doc
                     * @default: false
                     */
                    _deleted?: boolean;
                }
                /** Options for `bulkDocs()` */
                interface DocumentPouch<D extends NewDoc | MixedDoc> {
                    /** The array of documents to update */
                    docs: D[];
                }
                /** Options for `bulkDocs()` */
                interface DocumentPouchAndOptions<D extends NewDoc | MixedDoc>
                    extends BulkDocsOptions {
                    /** The array of documents to update */
                    docs: D[];
                }
                /** The options type for `bulkDocs()` */
                interface BulkDocsOptions extends options.EmptyOptions {
                    /** Advanced option: when set to `false` allows you to post and overwrite existing documents. */
                    new_edits?: boolean;
                }
                /** Error details for a document in a `bulkDocs()` operation
                 * @todo - does this really extend OperationResponse, or is `id` just sometimes present?
                 */
                interface BulkDocsError extends OperationResponse {
                    /** The error status (e.g. `409`) */
                    status: number;
                    /** The error name (e.g. `'conflict'`) */
                    name: string;
                    /** The error message */
                    message: string;
                    /** `true` if this is an error */
                    error: boolean;
                }
                /** Type union for the possible info/error type alternates returned by `bulkDocs()` */
                type BulkDocsResponse = OperationResponse | BulkDocsError;
                /**
                 * Callback pattern for bulkDocs()
                 * @todo a mixed doc array for mixed CUD updates
                 * @todo new_edits
                 */
                interface Callback {
                    /**
                     * Update/Delete each doc in an array of documents.
                     * @param options an options object with the documents to update/delete
                     */
                    bulkDocs(folder: DocumentPouchAndOptions<ExistingDoc>, callback?: async.Callback<BulkDocsResponse[]>): void;
                    /**
                     * Update/Delete each doc in an array of documents.
                     * @param options an options object with the documents to update/delete
                     */
                    bulkDocs(folder: DocumentPouch<ExistingDoc>, options: BulkDocsOptions, callback?: async.Callback<BulkDocsResponse[]>): void;
                    /**
                     * Update/Delete each doc in an array of documents.
                     * @param doc the doc
                     * @todo define options shape - docs don't make it clear what this is
                     */
                    bulkDocs(docs: ExistingDoc[], callback?: async.Callback<BulkDocsResponse[]>): void;
                    /**
                     * Update/Delete each doc in an array of documents.
                     * @param doc the doc
                     * @param options
                     * @todo define options shape - docs don't make it clear what this is
                     */
                    bulkDocs(docs: ExistingDoc[], options: BulkDocsOptions, callback?: async.Callback<BulkDocsResponse[]>): void;

                    /**
                     * Create multiple documents.
                     * @param doc the doc
                     */
                    bulkDocs(folder: DocumentPouchAndOptions<NewDoc>, callback?: async.Callback<BulkDocsResponse[]>): void;
                    /**
                     * Create multiple documents.
                     * @param doc the doc
                     */
                    bulkDocs(folder: DocumentPouch<NewDoc>, options: BulkDocsOptions, callback?: async.Callback<BulkDocsResponse[]>): void;
                    /**
                     * Create multiple documents.
                     * @param doc the doc
                     * @todo define options shape - docs don't make it clear what this is
                     */
                    bulkDocs(docs: NewDoc[], callback?: async.Callback<BulkDocsResponse[]>): void;
                    /**
                     * Create multiple documents.
                     * @param doc the doc
                     * @param options
                     * @todo define options shape - docs don't make it clear what this is
                     */
                    bulkDocs(docs: NewDoc[], options: BulkDocsOptions, callback?: async.Callback<BulkDocsResponse[]>): void;

                    /**
                     * Perform mixed Create/Update/Delete operations on multiple documents.
                     * @param options the doc
                     */
                    bulkDocs(folder: DocumentPouchAndOptions<MixedDoc>, callback?: async.Callback<BulkDocsResponse[]>): void;
                    /**
                     * Perform mixed Create/Update/Delete operations on multiple documents.
                     * @param options the doc
                     */
                    bulkDocs(folder: DocumentPouch<MixedDoc>, options: BulkDocsOptions, callback?: async.Callback<BulkDocsResponse[]>): void;
                    /**
                     * Perform mixed Create/Update/Delete operations on multiple documents.
                     * @param doc the doc
                     * @todo define options shape - docs don't make it clear what this is
                     */
                    bulkDocs(docs: MixedDoc[], callback?: async.Callback<BulkDocsResponse[]>): void;
                    /**
                     * Perform mixed Create/Update/Delete operations on multiple documents.
                     * @param doc the doc
                     * @param options
                     * @todo define options shape - docs don't make it clear what this is
                     */
                    bulkDocs(docs: MixedDoc[], options: BulkDocsOptions, callback?: async.Callback<BulkDocsResponse[]>): void;
                }
                /** Promise pattern for bulkDocs() */
                interface Promisable {
                    /**
                     * Update/Delete each doc in an array of documents.
                     * @param folder the documents storage object
                     * @param options
                     * @todo define options shape - docs don't make it clear what this is
                     */
                    bulkDocs(folder: DocumentPouch<ExistingDoc>, options?: BulkDocsOptions): async.PouchPromise<BulkDocsResponse[]>;
                    /**
                     * Update/Delete each doc in an array of documents.
                     * @param doc the doc
                     * @param options
                     * @todo define options shape - docs don't make it clear what this is
                     */
                    bulkDocs(docs: ExistingDoc[], options?: BulkDocsOptions): async.PouchPromise<BulkDocsResponse[]>;
                    /**
                     * Create multiple documents.
                     * @param doc the doc
                     * @param options
                     */
                    bulkDocs(folder: DocumentPouch<NewDoc>): async.PouchPromise<BulkDocsResponse[]>;
                    /**
                     * Create multiple documents.
                     * @param doc the doc
                     * @param options
                     * @todo define options shape - docs don't make it clear what this is
                     */
                    bulkDocs(docs: NewDoc[], options?: BulkDocsOptions): async.PouchPromise<BulkDocsResponse[]>;
                    /**
                     * Perform mixed Create/Update/Delete operations on multiple documents.
                     * @param docs the documents to act on
                     * @param options
                     */
                    bulkDocs(folder: DocumentPouch<MixedDoc>): async.PouchPromise<BulkDocsResponse[]>;
                    /**
                     * Perform mixed Create/Update/Delete operations on multiple documents.
                     * @param docs the documents to act on
                     * @param options
                     * @todo define options shape - docs don't make it clear what this is
                     */
                    bulkDocs(docs: MixedDoc[], options?: BulkDocsOptions): async.PouchPromise<BulkDocsResponse[]>;
                }
            }

            /** Contains the method and call/return types for changes() */
            module changes {

                /** Options for `changes()` output */
                interface BaseOptions extends BasePaginationOptions {
                    /**
                     * Does "live" changes, using CouchDB's `_longpoll_` feed if remote.
                     * @default `false`
                     */
                    live?: boolean;
                    /**
                     * Start the results from the change immediately after the given sequence number.
                     * You can also pass `'now'` if you want only new changes (when `live` is `true`).
                     * @default undefined
                     */
                    since?: any; // string | number
                    /**
                     * Request timeout (in milliseconds).
                     * @default undefined
                     */
                    timeout?: number;
                }
                /** Options for filtering `changes()` output */
                interface FilterOptions {
                    /**
                     * Reference a filter function from a design document to selectively get updates.
                     * To use a view function, pass `'_view'` here and provide a reference to the view
                     * function in {@link #view}
                     * @see params
                     * @see view
                     */
                    filter?: any; // string | function(doc, params)
                    /** Only show changes for docs with these ids. */
                    doc_ids?: string[];
                    /**
                     *  Object containing properties that are passed to the filter function,
                     * e.g. `{"foo:"bar"}`, where `"bar"` will be available in the filter function
                     * as `params.query.foo`. To access the `params`, define your filter function like
                     * `function (doc, params) { ... }`.
                     * @see filter
                     */
                    query_params?: {};
                    /**
                     * Specify a view function (e.g. `'design_doc_name/view_name'`) to act as a filter.
                     * Documents counted as "passed" for a view filter if a map function emits at least
                     * one record for them (set {@linkcode #filter} to `'view'` to use this).
                     */
                    view?: string;
                }
                /** Advanced options for `changes()` */
                interface AdvancedOptions {
                    /**
                     * Available for non-http databases. Passing `false` prevents the changes feed
                     * from keeping all the documents in memory - in other words `complete` always has
                     * an empty results array, and the `change` event is the only way to get the event.
                     * @default true
                     */
                    returnDocs?: boolean;
                    /**
                     * Available for http databases. This configures how many changes to fetch at a
                     * time. Increasing this can reduce the number of requests made.
                     * @default 25
                     */
                    batch_size?: number;
                    /**
                     * Specifies how many revisions are returned in the changes array:
                     * `'main_only'`, will only return the current "winning" revision;
                     * `'all_docs'` will return all leaf revisions
                     * (including conflicts and deleted former conflicts).
                     * @default 'main_only'
                     */
                    style?: string;
                }

                /**
                 * Change event object
                 * @todo confirm shape
                 */
                interface ChangeInfo {
                    id: string;
                    seq: number;
                    changes: { rev: string }[];
                    deleted?: boolean;
                    /**
                     * The doc in the change
                     * @see ChangesOptions#include_docs
                     * @see ChangesOptionsAdv#include_docs
                     * @todo confirm the doc type
                     */
                    doc?: ExistingDoc;
                }
                /**
                 * Complete event object
                 * @todo confirm shape
                 */
                interface CompleteInfo {
                    status: string;
                    last_seq: number;
                    results: ChangeInfo[];
                }

                /** The event listeners for `changes()` */
                interface EventsOptions {
                    /**
                     * The `change` event listener. This event fires when a change has been found.
                     */
                    onChange?: (change: ChangeInfo) => void;

                    ///** The `create` event listener */
                    //create?: (???) => void;
                    ///** The `update` event listener */
                    //update?: (???) => void;
                    ///** The `delete` event listener */
                    //delete?: (???) => void;
                    ///** The `paused` event listener */
                    //paused?: (???) => void;

                    /**
                     * The `complete` event listener.  This event fires when all changes have been
                     * read. In live changes, only cancelling the changes should trigger this event.
                     */
                    complete?: (err: async.Error, info: CompleteInfo) => void;
                    /**
                     * The `error` event listener. This event is fired when the replication is stopped
                     * due to an unrecoverable failure.
                     * @todo: confirm error shape
                     */
                    error?: (err: any) => void;
                }

                /** Options for the `changes()` method */
                interface ChangesOptions extends EventsOptions, BaseOptions, FilterOptions { }
                /** Advanced options for the `changes()` method */
                interface ChangesOptionsAdv extends EventsOptions, ChangesOptions, AdvancedOptions { }

                /** Result object for changes() */
                interface ChangesResult {
                    /**
                     * Cancels all further event emissions for the call to
                     * `changes()` that returned this object
                     */
                    cancel(): void;
                }
                /** The overloads for changes() */
                interface Overloads {
                    /**
                     * A list of changes made to documents in the database, in the order they were made.
                     * @returns an object with the method `cancel()` to stop listening for new changes
                     */
                    changes(options: methods.changes.ChangesOptions): methods.changes.ChangesResult;
                    /**
                     * A list of changes made to documents in the database, in the order they were made
                     * (using advanced options).
                     * @returns an object with the method `cancel()` to stop listening for new changes
                     */
                    changes(options: methods.changes.ChangesOptionsAdv): methods.changes.ChangesResult;
                }
                /** Callback pattern for changes() */
                interface Callback { }
                /** Promise pattern for changes() */
                interface Promisable { }
            }

            /** Contains the method and call/return types for close() */
            module close {
                /** Callback pattern for close() */
                interface Callback {
                    /** Closes the pouchdb */
                    close(callback?: async.Callback<string>): void;
                }
                /** Promise pattern for close() */
                interface Promisable {
                    /** Closes the pouchdb */
                    close(): async.PouchPromise<string>;
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
                interface Promisable {
                    /**
                     * Deletes a database
                     * @param options ajax options
                     */
                    destroy(options?: options.OptionsWithAjax): async.PouchPromise<Info>;
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
                /** Response interface for `get()` */
                interface Response extends ExistingDoc {
                    /** @todo what shape are the array elements? */
                    _conflicts?: any; // some kind of []
                    /** @todo what shape are the array elements? */
                    _revs_info?: any; // some kind of []
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
                     */
                    get<R extends Response>(docId: string, callback?: async.Callback<R>): void;
                    /**
                     * Retrieves a document, specified by `docId`.
                     * @param docId the doc id
                     * @param options
                     */
                    get<R extends Response>(docId: string, options: Options, callback?: async.Callback<R>): void;
                }
                /** Promise pattern for remove */
                interface Promisable {
                    /**
                     * Retrieves a document, specified by `docId`.
                     * @param docId the doc id
                     * @param options
                     */
                    get<R extends ExistingDoc>(docId: string, options?: Options): async.PouchPromise<R>;
                }
            }

            /** Contains the method and call/return types for `id()` */
            module id {
                /** Callback pattern for `id()` */
                interface Callback {
                    /** Returns the instance id for the pouchdb */
                    id(callback?: async.Callback<string>): void;
                }
                /** Promise pattern for `id()` */
                interface Promisable {
                    /** Returns the instance id for the pouchdb */
                    id(): async.PouchPromise<string>;
                }
            }

            /** Contains the method and call/return types for `info()` */
            module info {
                /** Response object for `info()` */
                interface Response {
                    /** the name of the database, and also the unique identifier for the database */
                    db_name: string;
                    /** the total number of non-deleted documents in the database */
                    doc_count: number;
                    /** the sequence number of the database. It starts at 0 and gets incremented
                     * every time a document is added or modified. */
                    update_seq: number
                }
                /** Response object for `info()` */
                interface ResponseDebug extends Response {
                    /** (IndexedDB) either `'base64'` or `'binary'` */
                    idb_attachment_format: string;
                    /** (WebSQL) true if the SQLite Plugin is being used */
                    sqlite_plugin: string;
                    /** (WebSQL) either `'UTF-8'` or `'UTF-16'`. */
                    websql_encoding: string;
                    /** reflects the `auto_compaction` used to create the database */
                    auto_compaction: boolean;
                }
                /** Callback pattern for `info()` */
                interface Callback {
                    /** Returns the instance info for the pouchdb */
                    info(callback?: async.Callback<Response | ResponseDebug>): void;
                }
                /** Promise pattern for `info()` */
                interface Promisable {
                    /** Returns the instance info for the pouchdb */
                    info(): async.PouchPromise<Response | ResponseDebug>;
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
                    // overload order is important
                    /**
                     * Create a new document and let PouchDB auto-generate an _id for it
                     * (tip: use `put()` instead for better indexing)
                     * @param doc the doc (with no id)
                     * @todo define options shape - docs don't make it clear what this is
                     */
                    post(doc: BaseDoc, callback?: async.Callback<OperationResponse>): void;
                    /**
                     * Create a new document and let PouchDB auto-generate an _id for it
                     * (tip: use `put()` instead for better indexing)
                     * @param doc the doc (with no id)
                     * @param options ajax options
                     * @todo define options shape - docs don't make it clear what this is
                     */
                    post(doc: BaseDoc, options: options.EmptyOptions, callback?: async.Callback<OperationResponse>): void;
                }
                /** Promise pattern for post */
                interface Promisable {
                    /**
                     * Create a new document and let PouchDB auto-generate an _id for it.
                     * (tip: use `put()` instead for better indexing)
                     * @param doc the doc (with no id)
                     * @param options ajax options
                     * @todo define options shape - docs don't make it clear what this is
                     */
                    post(doc: BaseDoc, options?: options.EmptyOptions): async.PouchPromise<OperationResponse>;
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
                     * @todo define options shape - docs don't make it clear what this is
                     */
                    put(doc: ExistingDoc, callback?: async.Callback<OperationResponse>): void;
                    /**
                     * Update an existing document.
                     * @param doc the doc
                     * @param options
                     * @todo define options shape - docs don't make it clear what this is
                     */
                    put(doc: ExistingDoc, options: options.EmptyOptions, callback?: async.Callback<OperationResponse>): void;
                    /**
                     * Create a new document.
                     * @param doc the doc
                     * @todo define options shape - docs don't make it clear what this is
                     */
                    put(doc: NewDoc, callback?: async.Callback<OperationResponse>): void;
                    /**
                     * Create a new document.
                     * @param doc the doc
                     * @param options
                     * @todo define options shape - docs don't make it clear what this is
                     */
                    put(doc: NewDoc, options: options.EmptyOptions, callback?: async.Callback<OperationResponse>): void;
                    /**
                     * Update an existing document.
                     * @param doc the doc
                     * @param docId the doc id
                     * @param docRev the doc rev
                     * @todo define options shape - docs don't make it clear what this is
                     */
                    put(doc: BaseDoc, docId: string, docRev: string, callback?: async.Callback<OperationResponse>): void;
                    /**
                     * Update an existing document.
                     * @param doc the doc
                     * @param docId the doc id
                     * @param docRev the doc rev
                     * @param options
                     * @todo define options shape - docs don't make it clear what this is
                     */
                    put(doc: BaseDoc, docId: string, docRev: string, options: options.EmptyOptions, callback?: async.Callback<OperationResponse>): void;
                    /**
                     * Create a new document. If the document already exists,
                     * you must use the update overload otherwise a conflict will occur.
                     * @param doc the doc
                     * @param docId the doc id
                     * @todo define options shape - docs don't make it clear what this is
                     */
                    put(doc: BaseDoc, docId: string, callback?: async.Callback<OperationResponse>): void;
                    /**
                     * Create a new document. If the document already exists,
                     * you must use the update overload otherwise a conflict will occur.
                     * @param doc the doc
                     * @param docId the doc id
                     * @param options
                     * @todo define options shape - docs don't make it clear what this is
                     */
                    put(doc: BaseDoc, docId: string, options: options.EmptyOptions, callback?: async.Callback<OperationResponse>): void;
                }
                /** Promise pattern for put */
                interface Promisable {
                    /**
                     * Update an existing document.
                     * @param doc the doc
                     * @param options
                     * @todo define options shape - docs don't make it clear what this is
                     */
                    put(doc: ExistingDoc, options?: options.EmptyOptions): async.PouchPromise<OperationResponse>;
                    /**
                     * Create a new document.
                     * @param doc the doc
                     * @param options
                     * @todo define options shape - docs don't make it clear what this is
                     */
                    put(doc: NewDoc, options?: options.EmptyOptions): async.PouchPromise<OperationResponse>;
                    /**
                     * Update an existing document.
                     * @param doc the doc
                     * @param docId the doc id
                     * @param docRev the doc rev
                     * @param options
                     * @todo define options shape - docs don't make it clear what this is
                     */
                    put(doc: BaseDoc, docId: string, docRev: string, options?: options.EmptyOptions): async.PouchPromise<OperationResponse>;
                    /**
                     * Create a new document. If the document already exists,
                     * you must use the update overload otherwise a conflict will occur.
                     * @param doc the doc
                     * @param docId the doc id
                     * @param options
                     * @todo define options shape - docs don't make it clear what this is
                     */
                    put(doc: BaseDoc, docId: string, options?: options.EmptyOptions): async.PouchPromise<OperationResponse>;
                }
            }

            /** Contains the method and call/return types for remove() */
            module remove {
                /** Options used in overlaods for `remove()` */
                interface RevOptions {
                    /** The current revision for the document to remove */
                    rev: string;
                }
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
                     * @todo define options shape - docs don't make it clear what this is
                     */
                    remove(docId: string, docRev: string, callback?: async.Callback<OperationResponse>): void;
                    /**
                     * Deletes the document.
                     * `doc` is required to be a document with at least an `_id` and a `_rev` property.
                     * Sending the full document will work as well.
                     * @param docId the doc id
                     * @param docRev the doc revision
                     * @param options
                     * @todo define options shape - docs don't make it clear what this is
                     */
                    remove(docId: string, docRev: string, options: options.EmptyOptions, callback?: async.Callback<OperationResponse>): void;
                    /**
                     * Deletes the document.
                     * `doc` is required to be a document with at least an `_id` and a `_rev` property.
                     * Sending the full document will work as well.
                     * @param doc the doc
                     * @param options
                     * @todo define options shape - docs don't make it clear what this is
                     */
                    remove(doc: ExistingDoc, callback?: async.Callback<OperationResponse>): void;
                    /**
                     * Deletes the document.
                     * `doc` is required to be a document with at least an `_id` and a `_rev` property.
                     * Sending the full document will work as well.
                     * @param doc the doc
                     * @param options
                     * @todo define options shape - docs don't make it clear what this is
                     */
                    remove(doc: ExistingDoc, options: options.EmptyOptions, callback?: async.Callback<OperationResponse>): void;
                    /**
                     * Deletes the document.
                     * `doc` is required to be a document with at least an `_id` property, `rev` is specified in the `options`.
                     * @param doc the doc (with only an `id` property)
                     * @param options options that specify
                     */
                    remove(doc: NewDoc, options: RevOptions, callback?: async.Callback<OperationResponse>): void;
                }
                /** Promise pattern for remove */
                interface Promisable {
                    /**
                     * Deletes the document.
                     * `doc` is required to be a document with at least an `_id` and a `_rev` property.
                     * Sending the full document will work as well.
                     * @param docId the doc id
                     * @param docRev the doc revision
                     * @param options
                     * @todo define options shape - docs don't make it clear what this is
                     */
                    remove(docId: string, docRev: string, options?: options.EmptyOptions): async.PouchPromise<OperationResponse>;
                    /**
                     * Deletes the document.
                     * `doc` is required to be a document with at least an `_id` and a `_rev` property.
                     * Sending the full document will work as well.
                     * @param doc the doc
                     * @param options
                     * @todo define options shape - docs don't make it clear what this is
                     */
                    remove(doc: ExistingDoc, options?: options.EmptyOptions): async.PouchPromise<OperationResponse>;
                    /**
                     * Deletes the document.
                     * `doc` is required to be a document with at least an `_id` property, `rev` is specified in the `options`.
                     * @param doc the doc (with only an `id` property)
                     * @param options options that specify
                     */
                    remove(doc: NewDoc, options: RevOptions): async.PouchPromise<OperationResponse>;
                }
            }

            /** Contains the method and call/return types for query()*/
            module query {

                /** Type union for the possible info/error type alternates returned by `query()` */
                type QueryResponse = Response | OperationResponse;

                interface QueryOptions {
                    reduce: boolean;
                    include_docs?: boolean;
                    startkey?: string;
                    endkey?: string;
                    key?: string;
                }

                interface MapReduce{
                    map?(doc: DocContainer<ExistingDoc>): void;
                    map?(doc: ExistingDoc): void;
                    /**
                     * @TODO change type if needed;
                     * @param key
                     * @param values
                     * @param rereduce
                     */
                    reduce?: string  |((key: string, values: any, rereduce: any) => number);
                }



                export function emit(key:any, value:any):void;

                interface Callback {
                    /**
                     * Query document.
                     * @param queryFun
                     * @options options options that specify
                     */
                    query(queryFun: MapReduce, callback?: async.Callback<Response>): void;

                    /**
                     * Query document.
                     * @param queryFun
                     * @options options options that specify
                     */
                    query(queryFun: MapReduce, options: options.EmptyOptions, callback: async.Callback<Response>): void;
                    /**
                     * Query document.
                     * @param queryFun
                     * @options options options that specify
                     */
                    query(queryFun: MapReduce, options: QueryOptions, callback: async.Callback<Response>): void;


                }
                interface Promisable {
                    /*
                     * Query document.
                     * @param queryFun
                     * @options options options that specify
                     */
                    query(queryFun: MapReduce, options?: QueryOptions): async.PouchPromise<Response>;

                }
            }
            module replicate {
                module from {
                    interface Callback {
                        from(instance: PouchInstance,  callback: async.Callback<Response>): void;
                    }
                    interface Promisable {
                        from(instance: PouchInstance):async.PouchPromise<Response>;
                    }
                }
            }

        }
        /** Contains the main callback/promise apis for pouchdb */
        module db {
            /** pouchDB api: callback based */
            interface Callback extends
                PouchInstance
                , methods.allDocs.Callback
                , methods.bulkDocs.Callback
                , methods.changes.Overloads
                , methods.close.Callback
                , methods.destroy.Callback
                , methods.get.Callback
                , methods.id.Callback
                , methods.info.Callback
                , methods.post.Callback
                , methods.put.Callback
                , methods.remove.Callback
                , methods.query.Callback { }
            /** pouchDB api: promise based */
            interface Promisable extends
                PouchInstance
                , methods.allDocs.Promisable
                , methods.bulkDocs.Promisable
                , methods.changes.Overloads
                , methods.close.Promisable
                , methods.destroy.Promisable
                , methods.get.Promisable
                , methods.id.Promisable
                , methods.info.Promisable
                , methods.post.Promisable
                , methods.put.Promisable
                , methods.remove.Promisable
                , methods.query.Promisable { }

            module replicate {

                export interface Callback extends
                    methods.replicate.from.Callback { }
                export interface Promisable extends
                    methods.replicate.from.Promisable { }
            }

        }

        /** The main pouchDB interface */
        interface PouchInstance {
            /** The adapter being used by this db instance */
            adapter: string;
            /** The database type */
            type(): string;
            /** undocumented */
            _blobSupport: boolean;
        }

        //  Errors (see pouchdb/lib/deps/errors.js /////////////////////////////

        /** A PouchDB error definition */
        interface PouchError {
            /** The error status number */
            status: number;
            /** The standard error message property */
            message: string;
            /** The error name */
            name: string;
            /** set to `true` for an error */
            error: boolean;
        }

        /** A PouchDB error definition with a reason property */
        interface CustomPouchError extends PouchError {
            /** The error reason */
            reason: string;
        }

        /** A PouchDB error definition created from a response */
        interface ResponsePouchError extends CustomPouchError {
            /** the response id */
            id?: string;
            /** todo description
             * @todo type annotation
             */
            missing?: any;
        }

        /**
         * The collection of error definitions defined for PouchDB
         * @todo are these adapter dependent?
         * */
        interface StandardErrors {
            /** Create a new error */
            error(base: PouchError, reason?: string, name?: string): CustomPouchError;
            /** Create a new error */
            error<R extends CustomPouchError>(base: PouchError, reason?: string, name?: string): R;
            /** Create an error from a response */
            generateErrorFromResponse(response: any): ResponsePouchError;

            /** (401): Name or password is incorrect. */
            UNAUTHORIZED: PouchError
            /** (400): Missing JSON list of 'docs' */
            MISSING_BULK_DOCS: PouchError
            /** (404): missing */
            MISSING_DOC: PouchError
            /** (409): Document update conflict */
            REV_CONFLICT: PouchError
            /** (400): _id field must contain a string */
            INVALID_ID: PouchError
            /** (412): _id is required for puts */
            MISSING_ID: PouchError
            /** (400): Only reserved document ids may start with underscore. */
            RESERVED_ID: PouchError
            /** (412): Database not open */
            NOT_OPEN: PouchError
            /** (500): Database encountered an unknown error */
            UNKNOWN_ERROR: PouchError
            /** (500): Some query argument is invalid */
            BAD_ARG: PouchError
            /** (400): Request was invalid */
            INVALID_REQUEST: PouchError
            /** (400): Some query parameter is invalid */
            QUERY_PARSE_ERROR: PouchError
            /** (500): Bad special document member
             * Bad special document member (`message` will include the bad member name(s)) */
            DOC_VALIDATION: PouchError
            /** (400): Something wrong with the request.
             *      Check `reason` on the returned error for the underlying cause */
            BAD_REQUEST: PouchError
            /** (400): Document must be a JSON object */
            NOT_AN_OBJECT: PouchError
            /** (404): Database not found */
            DB_MISSING: PouchError
            /** (500): unknown */
            IDB_ERROR: PouchError
            /** (500): unknown */
            WSQ_ERROR: PouchError
            /** (500): unknown */
            LDB_ERROR: PouchError
            /** (403): Forbidden by design doc validate_doc_update function */
            FORBIDDEN: PouchError
            /** (400): Invalid rev format */
            INVALID_REV: PouchError
            /** (412): The database could not be created, the file already exists. */
            FILE_EXISTS: PouchError
            /** (412): missing_stub */
            MISSING_STUB: PouchError
        }
    }
    /** The api module for the pouchdb callback pattern */
    module callback {
        /** The main pouchDB interface (callback pattern) */
        interface PouchDB extends api.db.Callback {
            replicate: api.db.replicate.Callback;
        }
    }
    /** The api module for the pouchdb promise pattern */
    module promise {
        /** The main pouchDB interface (promise pattern) */
        interface PouchDB extends api.db.Promisable {
            replicate: api.db.replicate.Promisable;
        }
    }
    /** The api module for the pouchdb promise pattern (constructor only) */
    module thenable {
        /**
         * Special case class returned by the constructors of the promise api pouchDB.
         * Usually only a `pouchdb.promise.PouchDB` reference would be kept, assigned by
         * the `then` of the constructor.
         */
        interface PouchDB extends promise.PouchDB, async.PouchPromise<promise.PouchDB> { }
    }

    /** Static-side interface for PouchDB */
    export interface PouchDB {
        /** Error helpers */
        Errors: api.StandardErrors;
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
         * @returns a thenable.PouchDB
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
         * @returns a thenable.PouchDB
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
         * @returns a thenable.PouchDB
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
         * @returns a thenable.PouchDB
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
         * @returns a thenable.PouchDB
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
         * @returns a thenable.PouchDB
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
         * @returns a thenable.PouchDB
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
         * @returns a thenable.PouchDB
         */
        new (name: string, options: any): thenable.PouchDB;
        /**
         * A fallback constructor if none of the typed constructors cover a use case
         * @todo if you find yourself using this, consider contributing a patch
         * to add/improve the necessary typed overload instead of `options: pouchdb.options.DbName`
         * @returns a thenable.PouchDB
         */
        new (options: options.ctor.DbName): thenable.PouchDB;
    }
}
