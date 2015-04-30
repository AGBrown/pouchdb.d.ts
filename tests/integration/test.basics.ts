// Type definitions for pouchdb v3.4.0
// Project: http://pouchdb.com/, https://github.com/pouchdb/pouchdb
// Definitions by: Andy Brown <https://github.com/AGBrown>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
// THIS FILE:
//  This file recreates the tests in:
//      pouchdb/tests/integration/test.basics.js

/// <reference path="../../typings/chai/chai.d.ts" />
/// <reference path="../../typings/mocha/mocha.d.ts" />
/// <reference path="../../pouchdb.d.ts" />
/// <reference path="utils.d.ts" />
/// <reference path="test.basics.extra.ts" />
'use strict';

import expect = chai.expect;
type TestDoc = pouchdb.test.integration.TestDoc;
type ValueDoc = pouchdb.test.integration.ValueDoc;

var adapters: string[] = ['http', 'local'];

interface dbsShape {
    name?: string;
}

adapters.forEach((adapter: string) => {
    describe("test.basics.js-" + adapter,() => {
        var dbs: dbsShape = {};
        beforeEach((done) => {
            dbs.name = "foo";
            testUtils.cleanup([dbs.name], done);
        });

        after((done) => {
            testUtils.cleanup([dbs.name], done);
        });

        it("create a pouch",(done) => {
            new PouchDB(dbs.name, (err, db) => {
                //  typescript: can't really handle should, so need to use expect instead
                expect(err).not.to.exist;
                expect(db).to.be.an.instanceOf(PouchDB);
            });
        });

        it('Create a pouch with a promise', (done) => {
            new PouchDB(dbs.name).then((db) => {
                expect(db).to.be.an.instanceof(PouchDB);
                done();
            }, done);
        });

        it('Catch an error when creating a pouch with a promise', (done) => {
            //  typescript: requires the argument, therefore we have to pass undefined to force an error
            new PouchDB(undefined).catch((err) => {
                expect(err).to.exist;
                done();
            });
        });

        it('destroy a pouch', (done) => {
            new PouchDB(dbs.name, (err, db) => {
                expect(db).to.exist;
                db.destroy((err, info) => {
                    expect(err).not.to.exist;
                    expect(info).to.exist;
                    expect(info.ok).to.equal(true);
                    done();
                });
            });
        });

        it('destroy a pouch, with a promise', (done) => {
            //  typescript: we are splitting either callbacks or promises, not mixing
            new PouchDB(dbs.name).then((db) => {
                expect(db).to.exist;
                db.destroy().then((info) => {
                    expect(info).to.exist;
                    expect(info.ok).to.equal(true);
                    done();
                }, done);
            });
        });

        it('Add a doc', (done) => {
            var db = new PouchDB(dbs.name,(err, val) => { });
            db.post({ test: 'somestuff' }, (err, info) => {
                expect(err).not.to.exist;
                done();
            });
        });

        it('Add a doc with a promise', (done) => {
            var db = new PouchDB(dbs.name);
            db.post({ test: 'somestuff' }).then((info) => {
                done();
            }, done);
        });

        it('Modify a doc', (done) => {
            var db = new PouchDB(dbs.name, (err, val) => { });
            db.post({ test: 'somestuff' }, (err, info) => {
                db.put({
                    _id: info.id,
                    _rev: info.rev,
                    another: 'test'
                }, (err, info2) => {
                        expect(err).not.to.exist;
                        expect(info.rev).not.to.equal(info2.rev);
                        done();
                    });
            });
        });

        it('Modify a doc with sugar syntax', (done) => {
            var db = new PouchDB(dbs.name,(err, val) => { });
            db.post({ test: 'somestuff' }, (err, info) => {
                db.put({ another: 'test' }, info.id, info.rev, (err, info2) => {
                    expect(info.rev).not.to.equal(info2.rev);
                    db.put({ yet_another: 'test' }, 'yet_another', (err, info3) => {
                        expect(info3.id).to.equal('yet_another');
                        expect(info.rev).not.to.equal(info2.rev);
                        done();
                    });
                });
            });
        });

        it('Modify a doc with sugar syntax and omit the _id',(done) => {
            var db = new PouchDB(dbs.name,(err, db) => { });
            db.post({ test: 'somestuff' },(err, info) => {
                db.put({ another: 'test', _id: info.id }, info.rev,
                    (err, info2) => {
                        expect(info.rev).not.to.equal(info2.rev);
                        db.put({ yet_another: 'test' }, 'yet_another', (err, info3) => {
                            expect(info3.id).to.equal('yet_another');
                            expect(info.rev).not.to.equal(info2.rev);
                            done();
                        });
                    });
            });
        });

        it('Modify a doc with a promise', (done) => {
            var db = new PouchDB(dbs.name);
            db.post({ test: 'promisestuff' }).then((info) => {
                return db.put({
                    _id: info.id,
                    _rev: info.rev,
                    another: 'test'
                }).then(function (info2) {
                    expect(info.rev).not.to.equal(info2.rev);
                });
            }).catch(done).then(() => {
                done();
            });
        });

        it('Read db id', (done) => {
            var db = new PouchDB(dbs.name,(err, db) => { });
            db.id(function (err, id) {
                expect(id).to.be.a('string');
                done(err);
            });
        });

        it('Read db id with promise', (done) => {
            var db = new PouchDB(dbs.name);
            db.id().then((id) => {
                expect(id).to.be.a('string');
                done();
            });
        });

        it('Close db',(done) => {
            new PouchDB(dbs.name, (err, db) => {
                db.close(done);
            });
        });

        it('Close db with a promise',(done) => {
            new PouchDB(dbs.name).then((db) => {
                db.close();
            }).then(done, done);
        });

        it('Read db id after closing Close',(done) => {
            new PouchDB(dbs.name, (err, db) => {
                db.close((error) => {
                    db = new PouchDB(dbs.name,() => { });
                    db.id((err, id) => {
                        expect(id).to.be.a('string');
                        done();
                    });
                });
            });
        });

        it('Modify a doc with incorrect rev',(done) => {
            var db = new PouchDB(dbs.name,(err, db) => { });
            db.post({ test: 'somestuff' },(err, info) => {
                var nDoc = {
                    _id: info.id,
                    _rev: info.rev + 'broken',
                    another: 'test'
                };
                db.put(nDoc,(err, info2) => {
                    expect(err).to.exist;
                    done();
                });
            });
        });

        it('Remove doc', (done) => {
            var db = new PouchDB(dbs.name,(err, db) => { });
            db.post({ test: 'somestuff' },(err, info) => {
                db.remove({
                    test: 'somestuff',
                    _id: info.id,
                    _rev: info.rev
                }, (doc) => {
                        db.get(info.id, (err) => {
                            expect(err.error).to.exist;
                            done();
                        });
                    });
            });
        });

        it('Remove doc with a promise',(done) => {
            var db = new PouchDB(dbs.name);
            db.post({ test: 'someotherstuff' }).then((info) => {
                return db.remove({
                    test: 'someotherstuff',
                    _id: info.id,
                    _rev: info.rev
                }).then(() => {
                    return db.get<TestDoc>(info.id).then((doc) => {
                        done(true);
                    }, (err) => {
                            expect(err.error).to.exist;
                            done();
                        });
                });
            });
        });

        it('Remove doc with new syntax', (done) => {
            var db = new PouchDB(dbs.name,(err, db) => { });
            db.post({ test: 'somestuff' },(err, info) => {
                db.remove(info.id, info.rev, (err) => {
                    expect(err).not.to.exist;
                    db.get(info.id, (err) => {
                        expect(err).to.exist;
                        done();
                    });
                });
            });
        });

        it('Remove doc with new syntax and a promise', (done) => {
            var db = new PouchDB(dbs.name);
            var id;
            db.post({ test: 'someotherstuff' }).then((info) => {
                id = info.id;
                return db.remove(info.id, info.rev);
            }).then(() => {
                return db.get<TestDoc>(id);
            }).then((doc) => {
                done(true);
            }, (err) => {
                    expect(err.error).to.exist;
                    done();
                });
        });

        it('Doc removal leaves only stub', (done) => {
            var db = new PouchDB(dbs.name,(err, db) => { });
            db.put({ _id: 'foo', value: 'test' }, (err, res) => {
                db.get<ValueDoc>('foo',(err, doc) => {
                    db.remove(doc,(err, res) => {
                        //  typescript: this is a bit of a lie - it is only an "ExistingDoc" after deletion
                        db.get<ValueDoc>('foo', { rev: res.rev },
                            (err, doc) => {
                            expect(doc).to.deep.equal({
                                _id: res.id,
                                _rev: res.rev,
                                _deleted: true
                            });
                            done();
                        });
                    });
                });
            });
        });

        it('Remove doc twice with specified id', () => {
            var db = new PouchDB(dbs.name);
            return db.put({ _id: 'specifiedId', test: 'somestuff' }).then(() => {
                return db.get<TestDoc>('specifiedId');
            }).then((doc) => {
                return db.remove(doc);
            }).then(() => {
                return db.put({
                    _id: 'specifiedId',
                    test: 'somestuff2'
                });
            }).then(() => {
                return db.get<TestDoc>('specifiedId');
            }).then((doc) => {
                return db.remove(doc);
            });
        });

        it('Remove doc, no callback', (done) => {
            var db = new PouchDB(dbs.name,(e, v) => { });
            var changes = db.changes({
                live: true,
                include_docs: true,
                onChange: (change) => {
                    if (change.doc._deleted) {
                        changes.cancel();
                    }
                },
                complete: (err, result) => {
                    expect(result.status).to.equal('cancelled');
                    done();
                }
            });
            db.post({ _id: 'somestuff' }, (err, res) => {
                db.remove({
                    _id: res.id,
                    _rev: res.rev
                });
            });
        });

        it('Delete document without id', (done) => {
            var db = new PouchDB(dbs.name, (e, v) => { });
            //  typescript won't let this test compile unless we specify _id and _rev to be undefined
            db.remove({
                test: 'ing',
                _id: undefined,
                _rev: undefined
            },(err) => {
                expect(err).to.exist;
                done();
            });
        });

        it('Delete document with many args', () => {
            var db = new PouchDB(dbs.name);
            var doc: pouchdb.api.methods.NewDoc = { _id: 'foo' };
            return db.put(doc).then((info) => {
                return db.remove(doc._id, info.rev, {});
            });
        });

        it('Delete document with many args, callback style', (done) => {
            var db = new PouchDB(dbs.name, (e, v) => { });
            var doc: pouchdb.api.methods.NewDoc = { _id: 'foo' };
            db.put(doc, (err, info) => {
                expect(err).not.to.exist;
                db.remove(doc._id, info.rev, {}, (err) => {
                    expect(err).not.to.exist;
                    done();
                });
            });
        });

        it('Delete doc with id + rev + no opts', () => {
            var db = new PouchDB(dbs.name);
            var doc: pouchdb.api.methods.NewDoc = { _id: 'foo' };
            return db.put(doc).then((info) => {
                return db.remove(doc._id, info.rev);
            });
        });

        it('Delete doc with id + rev + no opts, callback style', (done) => {
            var db = new PouchDB(dbs.name, (e, v) => { });
            var doc: pouchdb.api.methods.NewDoc = { _id: 'foo' };
            db.put(doc,(err, info) => {
                expect(err).not.to.exist;
                db.remove(doc._id, info.rev, (err) => {
                    expect(err).not.to.exist;
                    done();
                });
            });
        });

        it('Delete doc with doc + opts', () => {
            var db = new PouchDB(dbs.name);
            var doc: pouchdb.api.methods.NewDoc = { _id: 'foo' };
            return db.put(doc).then((info) => {
                //  typescript: downcast twice, or once and store in var, so do latter
                var doc2 = <pouchdb.api.methods.ExistingDoc>doc;
                doc2._rev = info.rev;
                return db.remove(doc2, {});
            });
        });

        it('Delete doc with doc + opts, callback style', (done) => {
            var db = new PouchDB(dbs.name, (e, v) => { });
            var doc: pouchdb.api.methods.NewDoc = { _id: 'foo' };
            db.put(doc, (err, info) => {
                expect(err).not.to.exist;
                //  typescript: downcast twice, or once and store in var, so do latter
                var doc2 = <pouchdb.api.methods.ExistingDoc>doc;
                doc2._rev = info.rev;
                db.remove(doc2, {}, (err) => {
                    expect(err).not.to.exist;
                    done();
                });
            });
        });

        //it('Delete doc with rev in opts', () => {
        //    var db = new PouchDB(dbs.name);
        //    var doc: pouchdb.api.methods.NewDoc = { _id: 'foo' };
        //    return db.put(doc).then((info) => {
        //        return db.remove(doc, { rev: info.rev });
        //    });
        //});

        it('Bulk docs', function (done) {
            var db = new PouchDB(dbs.name, (e, v) => { });
            db.bulkDocs({
                docs: [
                    { test: 'somestuff' },
                    { test: 'another' }
                ]
            }, function (err, infos) {
                    expect(infos.length).to.equal(2);
                    expect(infos[0].ok).to.equal(true);
                    expect(infos[1].ok).to.equal(true);
                    done();
                });
        });

        //  See: https://github.com/AGBrown/pouchdb.d.ts/issues/4
        it('Bulk docs - api version', function (done) {
            var db = new PouchDB(dbs.name, (e, v) => { });
            db.bulkDocs([
                { test: 'somestuff' },
                { test: 'another' }
            ], function (err, infos) {
                    expect(infos.length).to.equal(2);
                    expect(infos[0].ok).to.equal(true);
                    expect(infos[1].ok).to.equal(true);
                    done();
                });
        });
    });
});
