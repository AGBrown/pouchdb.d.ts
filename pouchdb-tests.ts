// Type definitions for pouchdb v3.4.0
// Project: http://pouchdb.com/, https://github.com/pouchdb/pouchdb
// Definitions by: Andy Brown <https://github.com/AGBrown> (https://github.com/AGBrown/pouchdb.d.ts)
// Definitions: https://github.com/borisyankov/DefinitelyTyped
// THIS FILE:
//  This file provides "compilation" tests for pouchdb.d.ts as per the DefinitelyTyped best practices

/// <reference path="pouchdb.d.ts" />
/// <reference path="pouchdb-loose.d.ts" />
/// <reference path="pouchdb-plugins.d.ts" />

module PouchDBTest {
    module promise {
        class Foo {
            foo: string;
        }

        class fakePromise<T> implements Promise<T> {
            new() { }

            then<R>(onFulfilled?: (value: T) => Promise<R> | R, onRejected?: (error: any) => Promise<R> | R) {
                return new fakePromise<R>();
            }

            catch<R>(onRejected: (error: any) => Promise<R> | R) {
                return undefined;
            }

            [Symbol.toStringTag]: string;
        }

        function chainedThen() {
            var fooOut: string;
            var db = new PouchDB("dbname");
            db.put({ foo: "test", _id: "1" })
                // TODO: still have to specify the type arg to get the correct return type  
                .then<pouchdb.api.methods.OperationResponse>(r => db.put({ foo: "test2", _id: "1" }))
                .then(r => r.id);
        }
    }

    module localDb {
        // common variables
        var dbp: pouchdb.promise.PouchDB;
        var dbc: pouchdb.callback.PouchDB;
        // common then, err and callback methods
        var myCb = (err: any, db: pouchdb.callback.PouchDB) => { };

        module localDbGeneral {
            function nameOnly() {
                //  create local db just using name
                dbp = new PouchDB("dbname");
                dbc = new PouchDB("dbname", undefined);
                dbc = new PouchDB("dbname", myCb);
            }

            function nameAndLocalDbOptions() {
                //  create local db using name and options
                var opts1: pouchdb.options.ctor.LocalDb = {
                    adapter: "idb",
                    auto_compaction: true
                };
                dbp = new PouchDB("dbname", opts1);
                dbc = new PouchDB("dbname", opts1, myCb);

                //  create local db using name and an extra option
                var opts2: pouchdb.options.ctor.LocalDb = {
                    adapter: "idb",
                    auto_compaction: true,
                    foo: "bar"
                };
                dbp = new PouchDB("dbname", opts2);
                dbc = new PouchDB("dbname", opts2, myCb);
            }

            function nameAndLocalDbOptionsNoType() {
                //  create local db using name and options
                new PouchDB("dbname", {
                    auto_compaction: true
                });

                //  create local db using name and options
                new PouchDB("dbname", {
                    adapter: "idb"
                });

                //  create local db using name and options
                new PouchDB("dbname", {
                    adapter: "idb",
                    auto_compaction: true
                });

                //  create local db using name and an extra option
                new PouchDB("dbname", {
                    adapter: "idb",
                    auto_compaction: true,
                    foo: "bar"
                });
            }

            function LocalDbWithName() {
                //  create local db using options with name
                var opts1: pouchdb.options.ctor.LocalDbWithName = {
                    name: "dbname",
                    adapter: "idb",
                    auto_compaction: false
                };
                dbp = new PouchDB(opts1);
                dbc = new PouchDB(opts1, myCb);
            }

            function LocalDbWithNameNoType() {
                //  create local db using options with name
                new PouchDB({
                    name: "dbname",
                    adapter: "idb",
                    auto_compaction: false
                });
            }
        }

        module sqLite {
            function nameAndLocalSQLiteDbOptions() {
                //  create local db using name and options
                var sqliteOpts: pouchdb.options.ctor.LocalSQLiteDb = {
                    adapter: "websql",
                    auto_compaction: true,
                    createFromLocation: 0,
                    location: 2,
                    size: 5
                };
                dbp = new PouchDB("dbname", sqliteOpts);
                dbc = new PouchDB("dbname", sqliteOpts, myCb);
            }

            function nameAndLocalSQLiteDbNoType() {
                //  create local db using name and options
                new PouchDB("dbname", {
                    adapter: "websql",
                    auto_compaction: true,
                    createFromLocation: 0,
                    location: 2,
                    size: 5
                });
            }

            function LocalSQLiteDbWithName() {
                //  create local db using name and options
                var sqliteOpts: pouchdb.options.ctor.LocalSQLiteDbWithName = {
                    name: "dbname",
                    adapter: "websql",
                    auto_compaction: true,
                    createFromLocation: 0,
                    location: 2,
                    size: 5
                };
                dbp = new PouchDB(sqliteOpts);
                dbc = new PouchDB(sqliteOpts, myCb);
            }

            function LocalSQLiteDbWithNameNoType() {
                //  create local db using name and options
                new PouchDB({
                    name: "dbname",
                    adapter: "websql",
                    auto_compaction: true,
                    createFromLocation: 0,
                    location: 2,
                    size: 5
                });
            }
        }

        module websql {
            function nameAndLocalWebSQLOptions() {
                //  create local db using name and options
                var sqliteOpts: pouchdb.options.ctor.LocalWebSQLDb = {
                    adapter: "websql",
                    auto_compaction: false,
                    size: 5
                };
                dbp = new PouchDB("dbname", sqliteOpts);
                dbc = new PouchDB("dbname", sqliteOpts, myCb);
            }

            function nameAndLocalWebSQLNoType() {
                //  create local db using name and options
                new PouchDB("dbname", {
                    adapter: "websql",
                    auto_compaction: false,
                    size: 5
                });
            }

            function LocalWebSQLWithName() {
                //  create local db using name and options
                var sqliteOpts: pouchdb.options.ctor.LocalWebSQLDbWithName = {
                    name: "dbname",
                    adapter: "websql",
                    auto_compaction: false,
                    size: 5
                };
                dbp = new PouchDB(sqliteOpts);
                dbc = new PouchDB(sqliteOpts, myCb);
            }

            function LocalWebSQLWithNameNoType() {
                //  create local db using name and options
                new PouchDB({
                    name: "dbname",
                    adapter: "websql",
                    auto_compaction: false,
                    size: 5
                });
            }
        }
    }

    module methods {
        module close {
            function callback() {
                var db: pouchdb.callback.PouchDB = new PouchDB("dbname", (e, v) => { });
                db.close();
                db.close((err, msg) => { });
            }

            function promise() {
                var db: pouchdb.promise.PouchDB = new PouchDB("dbname");
                db.close();
                db.close().then(msg => { }, err => { });
            }
        }
        module destroy {
            var destroyOpts = { ajax: "full" };

            function callback() {
                var db: pouchdb.callback.PouchDB = new PouchDB("dbname", (e, v) => { });
                var myCb1 = (err: any, info: pouchdb.api.methods.destroy.Info) => { };
                var myCb2 = () => { };
                //  As per the 3.4.0 http://pouchdb.com/api.html#delete_database
                db.destroy(destroyOpts, myCb1);
                db.destroy(myCb1);
                db.destroy(destroyOpts, myCb2);
                db.destroy(myCb2);
                db.destroy(destroyOpts);
                db.destroy();
            }

            function promise() {
                var myThen = (db: pouchdb.api.methods.destroy.Info) => { };
                var myErr = (err: any) => { };
                var db: pouchdb.promise.PouchDB = new PouchDB("dbname");

                db.destroy(destroyOpts).then(myThen, myErr);
                db.destroy().then(myThen, myErr);
            }
        }
        module get {
            interface TestDoc extends pouchdb.api.methods.ExistingDoc { test: string; }
            var id = "1";
            var test: string;

            function callback() {
                var db: pouchdb.callback.PouchDB = new PouchDB("dbname", (e, v) => { });
                db.get<TestDoc>(id);
                db.get<TestDoc>(id, (err, doc) => { test = doc.test; });

                db.get<TestDoc>(id, {});
                db.get<TestDoc>(id, {}, (err, doc) => { test = doc.test; });
            }

            function promise() {
                var db: pouchdb.promise.PouchDB = new PouchDB("dbname");
                db.get<TestDoc>(id);
                db.get<TestDoc>(id).then(doc => { test = doc.test; }, err => { });

                db.get<TestDoc>(id, {});
                db.get<TestDoc>(id, {}).then(doc => { test = doc.test; }, err => { });
            }
        }
        module put {
            var oe = {};
            var of = { foo: "test" };
            var eDoc: pouchdb.api.methods.ExistingDoc = { foo: "test", _id: "1", _rev: "1" };
            var nDoc: pouchdb.api.methods.NewDoc = { foo: "test", _id: "1" };
            var bDoc: pouchdb.api.methods.BaseDoc = { foo: "test" };
            var id = "1";
            var rv = "1";

            function callback() {
                var db: pouchdb.callback.PouchDB = new PouchDB("dbname", (e, v) => { });
                //  Overload tests for the callback versions of put
                db.put(eDoc);
                db.put(eDoc, (err, val) => { });
                db.put(eDoc, (err) => { });

                db.put(eDoc, oe);
                db.put(eDoc, of);
                db.put(eDoc, oe, (err, val) => { val.ok === true; });
                db.put(eDoc, of, (err, val) => { val.ok === true; });
                db.put(eDoc, of, (err) => { err.error; });

                db.put(nDoc);
                db.put(nDoc, (err, val) => { });

                db.put(nDoc, oe);
                db.put(nDoc, of);
                db.put(nDoc, oe, (err, val) => { val.ok === true; });
                db.put(nDoc, of, (err, val) => { val.ok === true; });
                db.put(nDoc, of, (err) => { err.error; });

                db.put(bDoc, id, rv);
                db.put(bDoc, id, rv, (err, val) => { val.ok === true; });

                db.put(bDoc, id, rv, oe);
                db.put(bDoc, id, rv, of);
                db.put(bDoc, id, rv, oe, (err, val) => { val.ok === true; });
                db.put(bDoc, id, rv, of, (err, val) => { val.ok === true; });
                db.put(bDoc, id, rv, of, (err) => { err.error; });

                db.put(bDoc, id);
                db.put(bDoc, id, (err, val) => { val.ok === true; });

                db.put(bDoc, id, oe);
                db.put(bDoc, id, of);
                db.put(bDoc, id, oe, (err, val) => { val.ok === true; });
                db.put(bDoc, id, of, (err, val) => { val.ok === true; });
                db.put(bDoc, id, of, (err) => { err.error; });
            }

            function promise() {
                var db: pouchdb.promise.PouchDB = new PouchDB("dbname");
                db.put(eDoc).then(resp => { }).catch(err => { });
                db.put(eDoc).catch(err => { });
                db.put(eDoc, {}).then(resp => { }, err => { }).catch(err => { });
                db.put(nDoc).then(resp => { }, err => { }).catch(err => { });
                db.put(nDoc, {}).then(resp => { }, err => { }).catch(err => { });
                db.put(bDoc, id, rv).then(resp => { }, err => { }).catch(err => { });
                db.put(bDoc, id, rv, {}).then(resp => { }, err => { }).catch(err => { });
                db.put(bDoc, id).then(resp => { }, err => { }).catch(err => { });
                db.put(bDoc, id, {}).then(resp => { }, err => { }).catch(err => { });
            }
        }
        module remove {
            var oe = {};
            var of = { foo: "test" };
            var or = { rev: "1" };
            var eDoc: pouchdb.api.methods.ExistingDoc = { foo: "test", _id: "1", _rev: "1" };
            var nDoc: pouchdb.api.methods.NewDoc = { foo: "test", _id: "1" };
            var bDoc: pouchdb.api.methods.BaseDoc = { foo: "test" };
            var id = "1";
            var rv = "1";

            function callback() {
                var db: pouchdb.callback.PouchDB = new PouchDB("dbname", (e, v) => { });
                db.remove(id, rv);
                db.remove(id, rv, (err, val) => { });

                db.remove(id, rv, {});
                db.remove(id, rv, {}, (err, val) => { });

                db.remove(eDoc);
                db.remove(eDoc, (err, val) => { });

                db.remove(eDoc, {});
                db.remove(eDoc, {}, (err, val) => { });

                db.remove(nDoc, or, (err, val) => { });
            }

            function promise() {
                var db: pouchdb.promise.PouchDB = new PouchDB("dbname");

                db.remove(id, rv);
                db.remove(id, rv, {});
                db.remove(id, rv, of);

                db.remove(eDoc);
                db.remove(eDoc, {});
                db.remove(eDoc, of);

                db.remove(nDoc, or);
            }
        }
    }
}
