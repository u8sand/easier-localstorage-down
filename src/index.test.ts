import test from 'tape'
import localstoragedown from '.'
import humbleLocalStorage from 'humble-localstorage'

const testCommon = require('abstract-leveldown/test/common')({
  test: test,
  factory: () => localstoragedown() as any,
  setUp: (t) => {
    humbleLocalStorage.clear()
    t.end()
  },
  tearDown: (t) => {
    humbleLocalStorage.clear()
    t.end()
  },
  snapshots: false,
  createIfMissing: false,
  errorIfExists: false,
})

// pass
require('abstract-leveldown/test/open-test').args(test, testCommon)
require('abstract-leveldown/test/open-test').open(test, testCommon)
require('abstract-leveldown/test/del-test').all(test, testCommon)
require('abstract-leveldown/test/get-test').all(test, testCommon)
require('abstract-leveldown/test/put-test').all(test, testCommon)
require('abstract-leveldown/test/batch-test').all(test, testCommon)
require('abstract-leveldown/test/chained-batch-test').all(test, testCommon)
require('abstract-leveldown/test/put-get-del-test').all(test, testCommon)
require('abstract-leveldown/test/iterator-test').all(test, testCommon)
require('abstract-leveldown/test/iterator-range-test').all(test, testCommon)
