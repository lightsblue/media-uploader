/*global describe: false, it: false, before: false, after: false, beforeEach: false, expect: false*/
var assert = require('assert'),
  fs = require('fs'),
  crypto = require('crypto'),
  MediaTree = require('../lib/media-tree');

describe('MediaTree', function () {
  'use strict';

  describe('#findFiles()', function () {
    it('should find all files recursively', function (done) {
      MediaTree.findFiles('test/media').then(function (files) {
        assert.deepEqual(files, ['test/media/bittorrent.jpg', 'test/media/sandbox_small.jpg', 'test/media/foo/IMG_1054.MOV', 'test/media/foo/bar/baroque.jpg']);
        done();
      }, function (err) {
        done(err);
      });
    });
  });

  describe('#hashFile()', function () {
    it('should get a hash for a single file', function (done) {
      MediaTree.hashFile('test/media/foo/IMG_1054.MOV').then(function (hash) {
        assert.equal(hash, 'fb88dbd52cf560c3efc0062e12858851');
        done();
      }, function (err) {
        done(err);
      });
    });
  });

  describe('#find()', function () {
    it('should get hashes for a list of files', function (done) {
      var t = new MediaTree('test/media');
      t.find().then(function (hashes) {
        assert.deepEqual(hashes, {
          '6847fee1d215fddc4523fb972db70b24': 'test/media/bittorrent.jpg',
          'b126efcf8e6372b9ba406ac4d055ef55': 'test/media/sandbox_small.jpg',
          'fb88dbd52cf560c3efc0062e12858851': 'test/media/foo/IMG_1054.MOV',
          '3b3add2bed1dea37d63fa6fc5a24660d': 'test/media/foo/bar/baroque.jpg'
        });
        done();
      }, function (err) {
        done(err);
      });
    });
  });

});
