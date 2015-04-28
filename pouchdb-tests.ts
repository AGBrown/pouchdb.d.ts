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
    }
}
