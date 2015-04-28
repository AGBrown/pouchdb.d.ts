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
            new PouchDB(dbs.name,(err: any, db: pouchdb.callback.PouchDB) => {
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
            var db = new PouchDB(dbs.name, (err, val) => { });
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
            var db = new PouchDB(dbs.name,(err, val) => { });
            db.post({ test: 'somestuff' }, (err, info: pouchdb.api.methods.OperationResponse) => {
                db.put({
                    _id: info.id,
                    _rev: info.rev,
                    another: 'test'
                }, (err, info2: pouchdb.api.methods.OperationResponse) => {
                        expect(err).not.to.exist;
                        expect(info.rev).not.to.equal(info2.rev);
                        done();
                    });
            });
        });

        it('Modify a doc with sugar syntax', (done) => {
            var db = new PouchDB(dbs.name,(err, val) => { });
            db.post({ test: 'somestuff' }, (err, info: pouchdb.api.methods.OperationResponse) => {
                db.put({ another: 'test' }, info.id, info.rev, (err, info2: pouchdb.api.methods.OperationResponse) => {
                    expect(info.rev).not.to.equal(info2.rev);
                    db.put({ yet_another: 'test' }, 'yet_another', (err, info3: pouchdb.api.methods.OperationResponse) => {
                        expect(info3.id).to.equal('yet_another');
                        expect(info.rev).not.to.equal(info2.rev);
                        done();
                    });
                });
            });
        });

        it('Modify a doc with sugar syntax and omit the _id',(done) => {
            var db = new PouchDB(dbs.name,(err, db) => { });
            db.post({ test: 'somestuff' },(err, info: pouchdb.api.methods.OperationResponse) => {
                db.put({ another: 'test', _id: info.id }, info.rev,
                    (err, info2: pouchdb.api.methods.OperationResponse) => {
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
            db.post({ test: 'somestuff' },(err, info: pouchdb.api.methods.OperationResponse) => {
                var nDoc = {
                    _id: info.id,
                    _rev: info.rev + 'broken',
                    another: 'test'
                };
                db.put(nDoc,(err, info2: pouchdb.api.methods.OperationResponse) => {
                    expect(err).to.exist;
                    done();
                });
            });
        });

        it('Remove doc', (done) => {
            var db = new PouchDB(dbs.name,(err, db) => { });
            db.post({ test: 'somestuff' },(err, info: pouchdb.api.methods.OperationResponse) => {
                db.remove({
                    test: 'somestuff',
                    _id: info.id,
                    _rev: info.rev
                }, (doc) => {
                        db.get(info.id, (err: pouchdb.async.Error) => {
                            expect(err.error).to.exist;
                            done();
                        });
                    });
            });
        });

        it('Remove doc with a promise', (done) => {
            var db = new PouchDB(dbs.name);
            db.post({ test: 'someotherstuff' }).then((info) => {
                return db.remove({
                    test: 'someotherstuff',
                    _id: info.id,
                    _rev: info.rev
                }).then(() => {
                    return db.get<pouchdb.test.integration.TestDoc>(info.id).then((doc) => {
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
            db.post({ test: 'somestuff' },(err, info: pouchdb.api.methods.OperationResponse) => {
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
                return db.get<pouchdb.test.integration.TestDoc>(id);
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
                db.get<pouchdb.test.integration.ValueDoc>('foo',(err, doc: pouchdb.test.integration.ValueDoc) => {
                    db.remove(doc,(err, res: pouchdb.api.methods.OperationResponse) => {
                        //  typescript: this is a bit of a lie - it is only an "ExistingDoc" after deletion
                        db.get<pouchdb.test.integration.ValueDoc>('foo', { rev: res.rev },
                            (err, doc: pouchdb.test.integration.ValueDoc) => {
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
                return db.get<pouchdb.test.integration.TestDoc>('specifiedId');
            }).then((doc) => {
                return db.remove(doc);
            }).then(() => {
                return db.put({
                    _id: 'specifiedId',
                    test: 'somestuff2'
                });
            }).then(() => {
                return db.get<pouchdb.test.integration.TestDoc>('specifiedId');
            }).then((doc) => {
                return db.remove(doc);
            });
        });
    });
});
