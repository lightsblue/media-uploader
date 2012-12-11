/*global describe: false, it: false, before: false, after: false, beforeEach: false, expect: false*/
var assert = require('assert'),
  fs = require('fs'),
  crypto = require('crypto'),
  MediaIndex = require('../lib/media-index'),
  MockDestination = require('./mock-destination'),
  expect = require('expect.js');

describe('MediaIndex', function () {
  'use strict';

  describe('#filterPreviouslyUploaded()', function () {
    var index, localHashToFile;

    before(function () {
      index = {
        "b126efcf8e6372b9ba406ac4d055ef55": {
          "type": "image/jpeg",
          "time": "2009-03-29T12:42:59"
        },
        "fb88dbd52cf560c3efc0062e12858851": {
          "type": "video/quicktime",
          "time": "2010-05-01T14:30:42-0400"
        },
        "ffff20fedaa176d2653b978acc6da143": {}
      };
      localHashToFile = {
        '6847fee1d215fddc4523fb972db70b24': 'test/media/bittorrent.jpg',
        'b126efcf8e6372b9ba406ac4d055ef55': 'test/media/sandbox_small.jpg',
        'fb88dbd52cf560c3efc0062e12858851': 'test/media/foo/IMG_1054.MOV',
        '3b3add2bed1dea37d63fa6fc5a24660d': 'test/media/foo/bar/baroque.jpg'
      };
    });

    it('should filter hashes that do not need uploading', function () {
      var t = new MediaIndex(null, new MockDestination(index));
      t.filterPreviouslyUploaded(localHashToFile);
      expect(localHashToFile).to.only.have.keys(['6847fee1d215fddc4523fb972db70b24', '3b3add2bed1dea37d63fa6fc5a24660d']);
    });

  });

});
