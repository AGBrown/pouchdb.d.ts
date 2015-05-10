// Type definitions for pouchdb v3.4.0
// Project: http://pouchdb.com/, https://github.com/pouchdb/pouchdb
// Definitions by: Andy Brown <https://github.com/AGBrown> (https://github.com/AGBrown/pouchdb.d.ts)
// Definitions: https://github.com/borisyankov/DefinitelyTyped
// THIS FILE:
//  This file recreates the tests in:
//    pouchdb/tests/integration/test.basics.js

/// <reference path="../../typings/chai/chai.d.ts" />
/// <reference path="../../typings/mocha/mocha.d.ts" />
/// <reference path="../../pouchdb.d.ts" />
/// <reference path="common.ts" />
/// <reference path="utils.d.ts" />
'use strict';

type TestDoc = pouchdb.test.integration.TestDoc;
type ValueDoc = pouchdb.test.integration.ValueDoc;

var adapters: string[] = ['http', 'local'];

adapters.forEach((adapter: string) => {
  describe('test.basics.js-' + adapter, () => {
    var dbs: dbsShape = {};
    beforeEach((done) => {
      dbs.name = testUtils.adapterUrl(adapter, 'testdb');
      testUtils.cleanup([dbs.name], done);
    });

    after((done) => {
      testUtils.cleanup([dbs.name], done);
    });

    it('Create a pouch', (done) => {
      new PouchDB(dbs.name, (err, db) => {
        should.not.exist(err);
        db.should.be.an.instanceof(PouchDB);
        done();
      });
    });

    it('Create a pouch with a promise', () => {
      return new PouchDB(dbs.name).then((db) => {
        db.should.be.an.instanceof(PouchDB);
      });
    });

    it('Catch an error when creating a pouch with a promise', (done) => {
      //  typescript: requires the argument, therefore we have to pass undefined to force an error
      new PouchDB(undefined).catch((err) => {
        should.exist(err);
        done();
      });
    });

    it('destroy a pouch', (done) => {
      new PouchDB(dbs.name, (err, db) => {
        should.exist(db);
        db.destroy((err, info) => {
          should.not.exist(err);
          should.exist(info);
          info.ok.should.equal(true);
          done();
        });
      });
    });

    it('destroy a pouch, with a promise', () => {
      return new PouchDB(dbs.name).then((db) => {
        should.exist(db);
        return db.destroy();
      }).then((info) => {
        should.exist(info);
        info.ok.should.equal(true);
      });
    });

    it('Add a doc', (done) => {
      var db = new PouchDB(dbs.name, noop);
      db.post({ test: 'somestuff' }, (err, info) => {
        should.not.exist(err);
        done();
      });
    });

    it('Add a doc with a promise', () => {
      var db = new PouchDB(dbs.name);
      return db.post({ test: 'somestuff' });
    });

    it('Modify a doc', (done) => {
      var db = new PouchDB(dbs.name, noop);
      db.post({ test: 'somestuff' }, (err, info) => {
        db.put({
          _id: info.id,
          _rev: info.rev,
          another: 'test'
        }, (err, info2) => {
            should.not.exist(err);
            info.rev.should.not.equal(info2.rev);
            done();
          });
      });
    });

    it('Modify a doc with sugar syntax', (done) => {
      var db = new PouchDB(dbs.name, noop);
      db.post({ test: 'somestuff' }, (err, info) => {
        db.put({ another: 'test' }, info.id, info.rev, (err, info2) => {
          info.rev.should.not.equal(info2.rev);
          db.put({ yet_another: 'test' }, 'yet_another', (err, info3) => {
            info3.id.should.equal('yet_another');
            info.rev.should.not.equal(info2.rev);
            done();
          });
        });
      });
    });

    it('Modify a doc with sugar syntax and omit the _id', (done) => {
      var db = new PouchDB(dbs.name, noop);
      db.post({ test: 'somestuff' }, (err, info) => {
        db.put({ another: 'test', _id: info.id }, info.rev,
          (err, info2) => {
            info.rev.should.not.equal(info2.rev);
            db.put({ yet_another: 'test' }, 'yet_another', (err, info3) => {
              info3.id.should.equal('yet_another');
              info.rev.should.not.equal(info2.rev);
              done();
            });
          });
      });
    });

    it('Modify a doc with a promise', () => {
      var db = new PouchDB(dbs.name);
      return db.post({ test: 'promisestuff' }).then((info) => {
        return db.put({
          _id: info.id,
          _rev: info.rev,
          another: 'test'
        }).then((info2) => {
          info.rev.should.not.equal(info2.rev);
        });
      });
    });

    it('Read db id', (done) => {
      var db = new PouchDB(dbs.name, noop);
      db.id(function (err, id) {
        id.should.be.a('string');
        done(err);
      });
    });

    it('Read db id with promise', () => {
      var db = new PouchDB(dbs.name);
      return db.id().then((id) => {
        id.should.be.a('string');
      });
    });

    it('Close db', (done) => {
      new PouchDB(dbs.name, (err, db) => {
        db.close(done);
      });
    });

    it('Close db with a promise', () => {
      return new PouchDB(dbs.name).then((db) => {
        return db.close();
      });
    });

    it('Read db id after closing Close', (done) => {
      new PouchDB(dbs.name, (err, db) => {
        db.close((error) => {
          db = new PouchDB(dbs.name, noop);
          db.id((err, id) => {
            id.should.be.a('string');
            done();
          });
        });
      });
    });

    it('Modify a doc with incorrect rev', (done) => {
      var db = new PouchDB(dbs.name, noop);
      db.post({ test: 'somestuff' }, (err, info) => {
        var nDoc = {
          _id: info.id,
          _rev: info.rev + 'broken',
          another: 'test'
        };
        db.put(nDoc, (err, info2) => {
          should.exist(err);
          done();
        });
      });
    });

    it('Remove doc', (done) => {
      var db = new PouchDB(dbs.name, noop);
      db.post({ test: 'somestuff' }, (err, info) => {
        db.remove({
          test: 'somestuff',
          _id: info.id,
          _rev: info.rev
        }, (doc) => {
            db.get(info.id, (err) => {
              should.exist(err.error);
              done();
            });
          });
      });
    });

    it('Remove doc with a promise', () => {
      var db = new PouchDB(dbs.name);
      return db.post({ test: 'someotherstuff' }).then((info) => {
        return db.remove({
          test: 'someotherstuff',
          _id: info.id,
          _rev: info.rev
        }).then(() => {
          return db.get<TestDoc>(info.id).then((doc) => {
            throw new Error('shouldn\'t have gotten here');
          }, (err) => {
              should.exist(err.error);
            });
        });
      });
    });

    it('Remove doc with new syntax', (done) => {
      var db = new PouchDB(dbs.name, noop);
      db.post({ test: 'somestuff' }, (err, info) => {
        db.remove(info.id, info.rev, (err) => {
          should.not.exist(err);
          db.get(info.id, (err) => {
            should.exist(err);
            done();
          });
        });
      });
    });

    it('Remove doc with new syntax and a promise', () => {
      var db = new PouchDB(dbs.name);
      var id;
      return db.post({ test: 'someotherstuff' }).then((info) => {
        id = info.id;
        return db.remove(info.id, info.rev);
      }).then(() => {
        return db.get<TestDoc>(id);
      }).then((doc) => {
        throw new Error('shouldn\'t have gotten here');
      }, (err) => {
        should.exist(err.error);
      });
    });

    it('Doc removal leaves only stub', (done) => {
      var db = new PouchDB(dbs.name, noop);
      db.put({ _id: 'foo', value: 'test' }, (err, res) => {
        db.get<ValueDoc>('foo', (err, doc) => {
          db.remove(doc, (err, res) => {
            db.get<pouchdb.api.methods.ExistingDoc>('foo', { rev: res.rev },
              (err, doc) => {
              doc.should.deep.equal({
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
      var db = new PouchDB(dbs.name, noop);
      var changes = db.changes({
        live: true,
        include_docs: true,
        onChange: (change) => {
          if (change.doc._deleted) {
            changes.cancel();
          }
        },
        complete: (err, result) => {
          result.status.should.equal('cancelled');
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
      var db = new PouchDB(dbs.name, noop);
      //  typescript won't let this test compile unless we specify _id and _rev to be undefined
      db.remove({
        test: 'ing',
        _id: undefined,
        _rev: undefined
      }, (err) => {
        should.exist(err);
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
      var db = new PouchDB(dbs.name, noop);
      var doc: pouchdb.api.methods.NewDoc = { _id: 'foo' };
      db.put(doc, (err, info) => {
        should.not.exist(err);
        db.remove(doc._id, info.rev, {}, (err) => {
          should.not.exist(err);
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
      var db = new PouchDB(dbs.name, noop);
      var doc: pouchdb.api.methods.NewDoc = { _id: 'foo' };
      db.put(doc, (err, info) => {
        should.not.exist(err);
        db.remove(doc._id, info.rev, (err) => {
          should.not.exist(err);
          done();
        });
      });
    });

    it('Delete doc with doc + opts', () => {
      var db = new PouchDB(dbs.name);
      var doc: pouchdb.api.methods.NewDoc = { _id: 'foo' };
      return db.put(doc).then((info) => {
        (<pouchdb.api.methods.ExistingDoc>doc)._rev = info.rev;
        return db.remove((<pouchdb.api.methods.ExistingDoc>doc), {});
      });
    });

    it('Delete doc with doc + opts, callback style', (done) => {
      var db = new PouchDB(dbs.name, noop);
      var doc: pouchdb.api.methods.NewDoc = { _id: 'foo' };
      db.put(doc, (err, info) => {
        should.not.exist(err);
        (<pouchdb.api.methods.ExistingDoc>doc)._rev = info.rev;
        db.remove((<pouchdb.api.methods.ExistingDoc>doc), {}, (err) => {
          should.not.exist(err);
          done();
        });
      });
    });

    it('Delete doc with rev in opts', () => {
      var db = new PouchDB(dbs.name);
      var doc: pouchdb.api.methods.NewDoc = { _id: 'foo' };
      return db.put(doc).then((info) => {
        return db.remove(doc, { rev: info.rev });
      });
    });

    it('Bulk docs', (done) => {
      var db = new PouchDB(dbs.name, noop);
      db.bulkDocs({
        docs: [
          { test: 'somestuff' },
          { test: 'another' }
        ]
      }, (err, infos) => {
          infos.length.should.equal(2);
          infos[0].ok.should.equal(true);
          infos[1].ok.should.equal(true);
          done();
        });
    });

    it('Bulk docs with a promise', () => {
      var db = new PouchDB(dbs.name);
      return db.bulkDocs({
        docs: [
          { test: 'somestuff' },
          { test: 'another' }
        ]
      }).then((infos) => {
        infos.length.should.equal(2);
        infos[0].ok.should.equal(true);
        infos[1].ok.should.equal(true);
      });
    });

    it('Basic checks', (done) => {
      var db = new PouchDB(dbs.name, noop);
      db.info((err, info) => {
        var updateSeq = info.update_seq;
        var doc = { _id: '0', a: 1, b: 1 };
        info.doc_count.should.equal(0);
        db.put(doc, (err, res) => {
          res.ok.should.equal(true);
          res.should.have.property('id');
          // typescript: property check
          expect(res.id).not.to.be.undefined;
          res.should.have.property('rev');
          // typescript: property check
          expect(res.rev).not.to.be.undefined;
          db.info((err, info) => {
            info.doc_count.should.equal(1);
            info.update_seq.should.not.equal(updateSeq);
            db.get(doc._id, (err, doc) => {
              doc._id.should.equal(res.id);
              doc._rev.should.equal(res.rev);
              db.get(doc._id, { revs_info: true }, (err, doc) => {
                doc._revs_info[0].status.should.equal('available');
                done();
              });
            });
          });
        });
      });
    });

    it('update with invalid rev', (done) => {
      var db = new PouchDB(dbs.name, noop);
      db.post({ test: 'somestuff' }, (err, info) => {
        should.not.exist(err);
        db.put({
          _id: info.id,
          _rev: 'undefined',
          another: 'test'
        }, (err, info2) => {
          should.exist(err);
          //  todo: `put` error is a `BulkDocsError`
          //  todo: `BulkDocsError` error has similar shape to `ErrorDefinition`
          err.status.should.equal(PouchDB.Errors.INVALID_REV.status);
          err.message.should.equal(PouchDB.Errors.INVALID_REV.message,
            'correct error message returned');
          done();
        });
      });
    });

    it('Doc validation', (done) => {
      var bad_docs = [
        { '_zing': 4 },
        { '_zoom': 'hello' },
        {
          'zane': 'goldfish',
          '_fan': 'something smells delicious'
        },
        { '_bing': { 'wha?': 'soda can' } }
      ];
      var db = new PouchDB(dbs.name, noop);
      db.bulkDocs({ docs: bad_docs }, (err, res) => {
        //  todo: `err` error is a `BulkDocsError` - was returning this from `res`
        err.status.should.equal(PouchDB.Errors.DOC_VALIDATION.status);
        err.message.should.equal(PouchDB.Errors.DOC_VALIDATION.message +
          ': _zing',
          'correct error message returned');
        done();
      });
    });

    it('Replication fields (#2442)', (done) => {
      var doc = {
        '_replication_id': 'test',
        '_replication_state': 'triggered',
        '_replication_state_time': 1,
        '_replication_stats': {}
      };
      var db = new PouchDB(dbs.name, noop);
      db.post(doc, (err, resp) => {
        should.not.exist(err);

        db.get(resp.id, (err, doc2) => {
          should.not.exist(err);

          //  typescript: as these are special case fields I'm not adding them to the advertised interfaces
          //    therefore do a hacky cast to {} then to ReplicationDoc to get the intellisense
          (<pouchdb.api.methods.ReplicationDoc><{}>doc2)._replication_id    .should.equal('test');
          (<pouchdb.api.methods.ReplicationDoc><{}>doc2)._replication_state   .should.equal('triggered');
          (<pouchdb.api.methods.ReplicationDoc><{}>doc2)._replication_state_time.should.equal(1);
          (<pouchdb.api.methods.ReplicationDoc><{}>doc2)._replication_stats   .should.eql({});

          done();
        });
      });
    });

    it('Testing issue #48',(done) => {
      var docs: pouchdb.api.methods.bulkDocs.MixedDoc[] = [
        { _id: '0' }, { _id: '1' }, { _id: '2' },
        { _id: '3' }, { _id: '4' }, { _id: '5' }
      ];
      var TO_SEND = 5;
      var sent = 0;
      var complete = 0;
      var timer;

      var db = new PouchDB(dbs.name, noop);

      var bulkCallback: pouchdb.async.Callback<pouchdb.api.methods.OperationResponse> = (err, res) => {
        should.not.exist(err);
        if (++complete === TO_SEND) {
          done();
        }
      };

      var save = () => {
        if (++sent === TO_SEND) {
          clearInterval(timer);
        }
        db.bulkDocs({ docs: docs }, bulkCallback);
      };

      timer = setInterval(save, 10);
    });

    it('Testing valid id', (done) => {
      var db = new PouchDB(dbs.name, noop);
      //  d.ts: one would hope that ts prevents this, but due to the BaseDoc overloads
      //    it is still possible to use an incorrect type on _id. ts is not
      //    really about rigidly enforcing contracts, just gentle persuasion to use the
      //    right forms, evidently!
      db.post({
        '_id': 123,
        test: 'somestuff'
      }, (err, info) => {
          should.exist(err);
          err.message.should.equal(PouchDB.Errors.INVALID_ID.message,
            'correct error message returned');
          done();
        });
    });

    it('Put doc without _id should fail', (done) => {
      var db = new PouchDB(dbs.name, noop);
      //  d.ts: must put _id as undefined to be able to write this in ts
      //    but not sure if the right error will return as a result
      db.put({ test: 'somestuff', _id: undefined }, (err, info) => {
        should.exist(err);
        err.message.should.equal(PouchDB.Errors.MISSING_ID.message,
          'correct error message returned');
        done();
      });
    });

    it('Put doc with bad reserved id should fail', (done) => {
      var db = new PouchDB(dbs.name, noop);
      db.put({
        _id: '_i_test',
        test: 'somestuff'
      }, (err, info) => {
          should.exist(err);
          err.status.should.equal(PouchDB.Errors.RESERVED_ID.status);
          err.message.should.equal(PouchDB.Errors.RESERVED_ID.message,
            'correct error message returned');
          done();
        });
    });

    it('update_seq persists', (done) => {
      var db = new PouchDB(dbs.name, noop);
      db.post({ test: 'somestuff' }, (err, info) => {
        new PouchDB(dbs.name, (err, db) => {
          db.info((err, info) => {
            info.update_seq.should.not.equal(0);
            info.doc_count.should.equal(1);
            done();
          });
        });
      });
    });

    it('deletions persists', (done) => {

      var db = new PouchDB(dbs.name, noop);
      var doc = { _id: 'staticId', contents: 'stuff' };

      function writeAndDelete(cb) {
        db.put(doc, (err, info) => {
          db.remove({
            _id: info.id,
            _rev: info.rev
          }, (doc) => {
              cb();
            });
        });
      }

      writeAndDelete(() => {
        writeAndDelete(() => {
          db.put(doc, () => {
            db.get(doc._id, { conflicts: true }, (err, details) => {
              details.should.not.have.property('_conflicts');
              done();
            });
          });
        });
      });
    });

    it('Error when document is not an object', (done) => {
      var db = new PouchDB(dbs.name);
      var doc1 = [{ _id: 'foo' }, { _id: 'bar' }];
      var doc2 = 'this is not an object';
      var count = 5;
      var callback = (err, resp) => {
        should.exist(err);
        count--;
        if (count === 0) {
          done();
        }
      };
      //  todo: d.ts definitions use BaseDoc as cannot yet specify "not a primitive"
      //    (see https://github.com/Microsoft/TypeScript/issues/1809)
      //    it should not therefore be possible to write any of these in ts
      //    but currently it is
      db.post(doc1, callback);
      db.post(doc2, callback);
      //db.put(doc1, callback);
      //db.put(doc2, callback);
      //db.bulkDocs({ docs: [doc1, doc2] }, callback);
    });

    it('Test instance update_seq updates correctly', (done) => {
      new PouchDB(dbs.name, (err, db1) => {
        var db2 = new PouchDB(dbs.name, noop);
        db1.post({ a: 'doc' }, () => {
          db1.info((err, db1Info) => {
            db2.info((err, db2Info) => {
              db1Info.update_seq.should.not.equal(0);
              db2Info.update_seq.should.not.equal(0);
              done();
            });
          });
        });
      });
    });

    it('Error works', () => {
      var newError = PouchDB.Errors
        .error(PouchDB.Errors.BAD_REQUEST, 'love needs no message');
      newError.status.should.equal(PouchDB.Errors.BAD_REQUEST.status);
      newError.name.should.equal(PouchDB.Errors.BAD_REQUEST.name);
      newError.message.should.equal(PouchDB.Errors.BAD_REQUEST.message,
        'correct error message returned');
      newError.reason.should.equal('love needs no message');
    });

    it('Fail to fetch a doc after db was deleted', (done) => {
      new PouchDB(dbs.name, (err, db) => {
        var db2 = new PouchDB(dbs.name, noop);
        var doc = { _id: 'foodoc' };
        var doc2 = { _id: 'foodoc2' };
        db.put(doc, () => {
          db2.put(doc2,() => {
            db.allDocs((err, docs) => {
              docs.total_rows.should.equal(2);
              db.destroy((err) => {
                should.not.exist(err);
                db2 = new PouchDB(dbs.name, noop);
                db2.get(doc._id, (err, doc) => {
                  err.status.should.equal(404);
                  done();
                });
              });
            });
          });
        });
      });
    });

    it('Fail to fetch a doc after db was deleted', () => {
      var doc = { _id: 'foodoc' };
      var doc2 = { _id: 'foodoc2' };
      return new PouchDB(dbs.name).then((db) => {
        var db2 = new PouchDB(dbs.name);
        return db.put(doc)
          .then(() => { return db2.put(doc2); })
          .then(() => { return db.allDocs(); })
          .then((docs) => {
          docs.total_rows.should.equal(2);
          return db.destroy();
        });
      }).then(() => {
        var db2 = new PouchDB(dbs.name);
        return db2.get(doc._id);
      }).then((doc) => {
        throw new Error('get doc after db.destroy should fail');
      },(err) => {
        err.status.should.equal(404);
      });
    });

    it('Cant add docs with empty ids', (done) => {
      var docs: pouchdb.api.methods.NewDoc[] = [
        <any>{},
        { _id: null },
        { _id: undefined },
        { _id: '' },
        { _id: <any>{} },
        { _id: '_underscored_id' }
      ];
      var num = docs.length;
      var db = new PouchDB(dbs.name, noop);
      docs.forEach((doc) => {
        db.put(doc, (err, info) => {
          should.exist(err);
          if (!--num) {
            done();
          }
        });
      });
    });

    it('Test doc with percent in ID', () => {
      var db = new PouchDB(dbs.name);
      var doc = {
        foo: 'bar',
        _id: 'foo%bar'
      };
      return db.put(doc).then((res) => {
        res.id.should.equal('foo%bar');
        doc.foo.should.equal('bar');
        return db.get('foo%bar');
      }).then((doc) => {
        doc._id.should.equal('foo%bar');
        return db.allDocs({ include_docs: true });
      }).then((res) => {
        var x = res.rows[0];
        x.id.should.equal('foo%bar');
        x.doc._id.should.equal('foo%bar');
        x.key.should.equal('foo%bar');
        should.exist(x.doc._rev);
      });
    });

    it('db.info should give correct name', () => {
      var db = new PouchDB(dbs.name);
      return db.info().then((info) => {
        info.db_name.should.equal('testdb');
      });
    });

    it('db.info should give auto_compaction = false (#2744)', () => {
      var db = new PouchDB(dbs.name, { auto_compaction: false });
      return db.info().then((info) => {
        (<pouchdb.api.methods.info.ResponseDebug>info).auto_compaction.should.equal(false);
      });
    });

    it('db.info should give auto_compaction = true (#2744)', () => {
      var db = new PouchDB(dbs.name, { auto_compaction: true });
      return db.info().then((info) => {
        // http doesn't support auto compaction
        (<pouchdb.api.methods.info.ResponseDebug>info).auto_compaction.should.equal(db.type() !== 'http');
      });
    });

    //it('db.info should give correct doc_count', function (done) {
    //  new PouchDB(dbs.name).then(function (db) {
    //    db.info().then(function (info) {
    //      info.doc_count.should.equal(0);
    //      return db.bulkDocs({ docs: [{ _id: '1' }, { _id: '2' }, { _id: '3' }] });
    //    }).then(function () {
    //      return db.info();
    //    }).then(function (info) {
    //      info.doc_count.should.equal(3);
    //      return db.get('1');
    //    }).then(function (doc) {
    //      return db.remove(doc);
    //    }).then(function () {
    //      return db.info();
    //    }).then(function (info) {
    //      info.doc_count.should.equal(2);
    //      done();
    //    }, done);
    //  }, done);
    //});

    //it('putting returns {ok: true}', function () {
    //  // in couch, it's {ok: true} and in cloudant it's {},
    //  // but the http adapter smooths this out
    //  return new PouchDB(dbs.name).then(function (db) {
    //    return db.put({ _id: '_local/foo' }).then(function (info) {
    //      true.should.equal(info.ok, 'putting local returns ok=true');
    //      return db.put({ _id: 'quux' });
    //    }).then(function (info) {
    //      true.should.equal(info.ok, 'putting returns ok=true');
    //      return db.bulkDocs([{ _id: '_local/bar' }, { _id: 'baz' }]);
    //    }).then(function (info) {
    //      info.should.have.length(2, 'correct num bulk docs');
    //      true.should.equal(info[0].ok, 'bulk docs says ok=true #1');
    //      true.should.equal(info[1].ok, 'bulk docs says ok=true #2');
    //      return db.post({});
    //    }).then(function (info) {
    //      true.should.equal(info.ok, 'posting returns ok=true');
    //    });
    //  });
    //});
    //it('putting is override-able', function (done) {
    //  var db = new PouchDB(dbs.name);
    //  var called = 0;
    //  var plugin = {
    //    initPull: function () {
    //      this.oldPut = this.put;
    //      this.put = function () {
    //        if (typeof arguments[arguments.length - 1] === 'function') {
    //          called++;
    //        }
    //        return this.oldPut.apply(this, arguments);
    //      };
    //    },
    //    cleanupPut: function () {
    //      this.put = this.oldPut;
    //    }
    //  };
    //  PouchDB.plugin(plugin);
    //  db.initPull();
    //  return db.put({ foo: 'bar' }, 'anid').then(function (resp) {
    //    called.should.be.above(0, 'put was called');
    //    return db.get('anid');
    //  }).then(function (doc) {
    //    doc.foo.should.equal('bar', 'correct doc');
    //  }).then(function () {
    //    done();
    //  }, done);
    //});

    //it('issue 2779, deleted docs, old revs COUCHDB-292', function (done) {
    //  var db = new PouchDB(dbs.name);
    //  var rev;

    //  db.put({ _id: 'foo' }).then(function (resp) {
    //    rev = resp.rev;
    //    return db.remove('foo', rev);
    //  }).then(function () {
    //    return db.get('foo');
    //  }).catch(function (err) {
    //    return db.put({ _id: 'foo', _rev: rev });
    //  }).then(function () {
    //    done(new Error('should never have got here'));
    //  }, function (err) {
    //      should.exist(err);
    //      done();
    //    });
    //});

    //it('issue 2779, correct behavior for undeleting', function () {

    //  if (testUtils.isCouchMaster()) {
    //    return true;
    //  }

    //  var db = new PouchDB(dbs.name);
    //  var rev;

    //  function checkNumRevisions(num) {
    //    return db.get('foo', {
    //      open_revs: 'all',
    //      revs: true
    //    }).then(function (fullDocs) {
    //      fullDocs[0].ok._revisions.ids.should.have.length(num);
    //    });
    //  }

    //  return db.put({ _id: 'foo' }).then(function (resp) {
    //    rev = resp.rev;
    //    return checkNumRevisions(1);
    //  }).then(function () {
    //    return db.remove('foo', rev);
    //  }).then(function () {
    //    return checkNumRevisions(2);
    //  }).then(function () {
    //    return db.allDocs({ keys: ['foo'] });
    //  }).then(function (res) {
    //    rev = res.rows[0].value.rev;
    //    return db.put({ _id: 'foo', _rev: rev });
    //  }).then(function () {
    //    return checkNumRevisions(3);
    //  });
    //});

    //it('issue 2888, successive deletes and writes', function () {
    //  var db = new PouchDB(dbs.name);
    //  var rev;

    //  function checkNumRevisions(num) {
    //    return db.get('foo', {
    //      open_revs: 'all',
    //      revs: true
    //    }).then(function (fullDocs) {
    //      fullDocs[0].ok._revisions.ids.should.have.length(num);
    //    });
    //  }
    //  return db.put({ _id: 'foo' }).then(function (resp) {
    //    rev = resp.rev;
    //    return checkNumRevisions(1);
    //  }).then(function () {
    //    return db.remove('foo', rev);
    //  }).then(function () {
    //    return checkNumRevisions(2);
    //  }).then(function () {
    //    return db.put({ _id: 'foo' });
    //  }).then(function (res) {
    //    rev = res.rev;
    //    return checkNumRevisions(3);
    //  }).then(function () {
    //    return db.remove('foo', rev);
    //  }).then(function () {
    //    return checkNumRevisions(4);
    //  });
    //});

    //it('2 invalid puts', function (done) {
    //  var db = new PouchDB(dbs.name);
    //  var called = 0;
    //  var cb = function () {
    //    if (++called === 2) {
    //      done();
    //    }
    //  };
    //  db.put({ _id: 'foo', _zing: 'zing' }, cb);
    //  db.put({ _id: 'bar', _zing: 'zing' }, cb);
    //});

    //if (adapter === 'local') {
    //  // TODO: this test fails in the http adapter in Chrome
    //  it('should allow unicode doc ids', function (done) {
    //    var db = new PouchDB(dbs.name);
    //    var ids = [
    //    // "PouchDB is awesome" in Japanese, contains 1-3 byte chars
    //      '\u30d1\u30a6\u30c1\u30e5DB\u306f\u6700\u9ad8\u3060',
    //      '\u03B2', // 2-byte utf-8 char: 3b2
    //      '\uD843\uDF2D', // exotic 4-byte utf-8 char: 20f2d
    //      '\u0000foo\u0000bar\u0001baz\u0002quux', // like mapreduce
    //      '\u0000',
    //      '\u30d1'
    //    ];
    //    var numDone = 0;
    //    ids.forEach(function (id) {
    //      var doc = { _id: id, foo: 'bar' };
    //      db.put(doc).then(function (info) {
    //        doc._rev = info.rev;
    //        return db.put(doc);
    //      }).then(function () {
    //        return db.get(id);
    //      }).then(function (resp) {
    //        resp._id.should.equal(id);
    //        if (++numDone === ids.length) {
    //          done();
    //        }
    //      }, done);
    //    });
    //  });

    //  // this test only really makes sense for IDB
    //  it('should have same blob support for 2 dbs', function () {
    //    var db1 = new PouchDB(dbs.name);
    //    return db1.info().then(function () {
    //      var db2 = new PouchDB(dbs.name);
    //      return db2.info().then(function () {
    //        if (typeof db1._blobSupport !== 'undefined') {
    //          db1._blobSupport.should.equal(db2._blobSupport,
    //            'same blob support');
    //        } else {
    //          true.should.equal(true);
    //        }
    //      });
    //    });
    //  });
    //}
  });
});
