# Typescript Definitions for [pouchdb][pouchdb] (v3.4.0+)

| branch | build status |
| ------ | ------------ |
| master | [![Build Status][travis-img-master]][travis-lnk] |
| dev    | [![Build Status][travis-img-dev]][travis-lnk]    |
| feat   | [![Build Status][travis-img-feat]][travis-lnk]   |

## Health Warnings

1. **What this repo is:** It is a dev repo; the structure of the d.ts module layout and interface naming may change significantly in the early stages of development.
1. **What this repo needs:** [Contributions and discussion](#contribution).

## Motivation:

The current [DefinitelyTyped][DefinitelyTyped] definition [file][pouchdb-dt-0.1] for [pouchdb][pouchdb] seems to be for Pouch 0.1 (according to the version in the comments). This repo was created just as v3.4.0 was released.

## Goals

To make typescript use of pouchdb:

1. self-documenting through typescript intellisense;
	![intellisense][this-img-d001]
1. accessible through a single intuitive `new PouchDB(......)` call;
1. support both promise and callback style pouchdb calls; and

therefore to:

1. type the results of callbacks and promises to allow easy discovery of the "next action";
1. write documentation for each definition member;
1. ensure robust multi-contributor definitions through CI; and to
1. follow the DefinitelyTyped [contribution guide][DefType-con-bp].

## Contribution

Discussion, Issues and [PRs][this-prs] encouraged.

### Discussions and Issues

 - irc://freenode.net/#pouchdb
 - https://gitter.im/AGBrown/pouchdb.d.ts.
 - Issues [here][this-issues] (regarding health warning 2 above: if there are issues then these will be retained in any repo rebuild)

### Guide

The current dev methodology is to recreate the test files in the [pouchdb/tests][pouchdb-tests] folder by building supporting defintions in pouchdb.d.ts and using the public pouchdb [api docs][pouchdb-api-docs] to add "correctness" tests.
Any changes to the definitions must therefore:

1. Create a reliable replica of the relevant [pouchdb/tests][pouchdb-tests] .js files <sup>†</sup>
2. Include ["correctness" tests](http://definitelytyped.org/guides/contributing.html#tests) in pouchdb-tests.ts
3. Pass the travis build

<sup>†</sup> *Currently this has to be "compared by eye": suggestions on improving this welcome*

## Structure

```
|--docs							supporting documentation for this repo
|--tests 						replica test files of pouchdb/tests
|  \--integration 				  (example)
|     |--test.basics.extra.ts 	  (example) extra stuff required to make the test file build
|     |--test.basics.ts 		  (example) a replica test file of pouchdb/tests/integration/test.basics.js
|     \--utils.d.ts 		  	  (example) a replica definition file for pouchdb/tests/integration/utils.js
|--typings 						typings files to support tests, builds etc.
|--.travis.yml 					the travis CI settings file
|--license
|--package.json 				the npm package.json file
|--pouchdb-tests.ts 			The "correctness" tests for pouchdb.d.ts
\--pouchdb.d.ts 				The actual pouchdb definitions file
```

The [readme-dt.md](README-dt.md) contains the final readme for the DefinitelyTyped repository



[DefinitelyTyped]: 	http://definitelytyped.org/ "definitelytyped.org"
[DefType-con-bp]: 	http://definitelytyped.org/guides/contributing.html "definitelytyped.org > contributing guidelines"
[pouchdb]: 			http://pouchdb.com/ "pouchdb.com"
[pouchdb-api-docs]:	http://pouchdb.com/api.html "pouchdb.com > api.html"
[pouchdb-git]: 		https://github.com/pouchdb/pouchdb "github/pouchdb/pouchdb"
[pouchdb-dt-0.1]: 	https://github.com/borisyankov/DefinitelyTyped/blob/c4fb7fa/pouchDB/pouch.d.ts "DefinitelyTyped pouch.d.ts at c4fb7fa"
[pouchdb-tests]: 	https://github.com/pouchdb/pouchdb/tree/3.4.0/tests "pouchdb v3.4.0 tests folder on github"
[this-issues]: 		https://github.com/AGBrown/pouchdb.d.ts/issues "pouchdb.d.ts issues"
[this-prs]: 		https://github.com/AGBrown/pouchdb.d.ts/pulls?q=is%3Aopen+is%3Apr "pouchdb.d.ts prs"
[this-img-d001]: 	https://github.com/AGBrown/pouchdb.d.ts/blob/master/docs/d001-intellisense.png "ts intellisense for pouchdb"

[travis-img-master]:https://travis-ci.org/AGBrown/pouchdb.d.ts.svg?branch=master "travis - master branch tests"
[travis-img-dev]: 	https://travis-ci.org/AGBrown/pouchdb.d.ts.svg?branch=dev "travis - dev branch tests"
[travis-img-feat]: 	https://travis-ci.org/AGBrown/pouchdb.d.ts.svg?branch=feat "travis - feat branch tests"
[travis-lnk]: 		https://travis-ci.org/AGBrown/pouchdb.d.ts "travis - pouchdb.d.ts"
