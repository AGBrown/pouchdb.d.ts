/// <reference path="pouchdb.d.ts" />

module promise {
    class Foo {
        foo: string;
    }
    class fakePromise<T> implements pouchdb.async.Thenable<T> {
        new() { }
        then<R>(onFulfilled?: (value: T) => pouchdb.async.Thenable<R>|R,
            onRejected?: (error: any) => pouchdb.async.Thenable<R>|R) {
            return new fakePromise<R>();
        }
        catch<R>(onRejected: (error: any) => pouchdb.async.Thenable<R>|R) {
            return undefined;
        }
    }
    function chainedThen() {
        var fooOut: string;
        new PouchDB("dbname")
            .then((db) => new fakePromise<Foo>())
            .then((value: Foo) => { fooOut = value.foo; });
    }
}

module PouchDBTest {
    module localDb {
        // common variables
        var dbt: pouchdb.thenable.PouchDB;
        var dbp: pouchdb.promise.PouchDB;
        var dbc: pouchdb.callback.PouchDB;
        // common then, err and callback methods
        var myThen = (db: pouchdb.promise.PouchDB) => { dbp = db };
        var myErr = (err: any) => { };
        var myCb = (err: any, db: pouchdb.callback.PouchDB) => { };

        module localDbGeneral {
            function nameOnly() {
                //  create local db just using name
                dbt = new PouchDB("dbname");
                dbc = new PouchDB("dbname", undefined);
                new PouchDB("dbname").then(myThen, myErr);
                dbc = new PouchDB("dbname", myCb);
            }

            function nameAndLocalDbOptions() {
                //  create local db using name and options
                var opts1: pouchdb.options.ctor.LocalDb = {
                    adapter: "idb",
                    auto_compaction: true
                };
                dbt = new PouchDB("dbname", opts1);
                new PouchDB("dbname", opts1).then(myThen, myErr);
                dbc = new PouchDB("dbname", opts1, myCb);

                //  create local db using name and an extra option
                var opts2: pouchdb.options.ctor.LocalDb = {
                    adapter: "idb",
                    auto_compaction: true,
                    foo: "bar"
                };
                dbt = new PouchDB("dbname", opts2);
                new PouchDB("dbname", opts2).then(myThen, myErr);
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
                dbt = new PouchDB(opts1);
                new PouchDB(opts1).then(myThen, myErr);
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
                dbt = new PouchDB("dbname", sqliteOpts);
                new PouchDB("dbname", sqliteOpts).then(myThen, myErr);
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
                dbt = new PouchDB(sqliteOpts);
                new PouchDB(sqliteOpts).then(myThen, myErr);
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
                dbt = new PouchDB("dbname", sqliteOpts);
                new PouchDB("dbname", sqliteOpts).then(myThen, myErr);
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
                dbt = new PouchDB(sqliteOpts);
                new PouchDB(sqliteOpts).then(myThen, myErr);
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
        module destroy {
            var destroyOpts = { ajax: "full" };

            function callback() {
                var db: pouchdb.callback.PouchDB = new PouchDB("dbname", undefined);
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

                var db1: pouchdb.thenable.PouchDB = new PouchDB("dbname");
                db1.destroy(destroyOpts).then(myThen, myErr);
                db1.destroy().then(myThen, myErr);

                var db2: pouchdb.promise.PouchDB = new PouchDB("dbname");
                db2.destroy(destroyOpts).then(myThen, myErr);
                db2.destroy().then(myThen, myErr);
            }
        }
        module put {
            var oe = { };
            var of = { foo: "test" };
            var eDoc: pouchdb.api.methods.ExistingDoc = { foo: "test", _id: "1", _rev: "1" };
            var nDoc: pouchdb.api.methods.NewDoc = { foo: "test", _id: "1" };
            var bDoc: pouchdb.api.methods.BaseDoc = { foo: "test" };
            var id = "1";
            var rv = "1";

            function callback() {
                var db: pouchdb.callback.PouchDB = new PouchDB("dbname",(e, v) => { });
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
                var db1: pouchdb.thenable.PouchDB = new PouchDB("dbname");
                var db2: pouchdb.promise.PouchDB = new PouchDB("dbname");

                db1.put(eDoc).then(resp => { }, err => { }).catch(err => { });
                db2.put(eDoc).then(resp => { }, err => { }).catch(err => { });
                db2.put(eDoc).then(resp => { }).catch(err => { });
                db2.put(eDoc).catch(err => { });

                db1.put(eDoc, {}).then(resp => { }, err => { }).catch(err => { });
                db2.put(eDoc, {}).then(resp => { }, err => { }).catch(err => { });

                db1.put(nDoc).then(resp => { }, err => { }).catch(err => { });
                db2.put(nDoc).then(resp => { }, err => { }).catch(err => { });

                db1.put(nDoc, {}).then(resp => { }, err => { }).catch(err => { });
                db2.put(nDoc, {}).then(resp => { }, err => { }).catch(err => { });

                db1.put(bDoc, id, rv).then(resp => { }, err => { }).catch(err => { });
                db2.put(bDoc, id, rv).then(resp => { }, err => { }).catch(err => { });

                db1.put(bDoc, id, rv, {}).then(resp => { }, err => { }).catch(err => { });
                db2.put(bDoc, id, rv, {}).then(resp => { }, err => { }).catch(err => { });

                db1.put(bDoc, id).then(resp => { }, err => { }).catch(err => { });
                db2.put(bDoc, id).then(resp => { }, err => { }).catch(err => { });

                db1.put(bDoc, id, {}).then(resp => { }, err => { }).catch(err => { });
                db2.put(bDoc, id, {}).then(resp => { }, err => { }).catch(err => { });
            }
        }
    }
}
