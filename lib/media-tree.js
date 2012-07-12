var assert = require('assert'),
  fs = require('fs'),
  crypto = require('crypto'),
  when = require('when'),
  hashCount = 1;

function walk(dir, done) {
  'use strict';
  var results = [];
  fs.readdir(dir, function (err, list) {
    if (err) {
      return done(err);
    }
    var pending = list.length;
    if (!pending) {
      return done(null, results);
    }
    list.forEach(function (file) {
      file = dir + '/' + file;
      fs.stat(file, function (err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function (err, res) {
            results = results.concat(res);
            if (!--pending) {
              done(null, results);
            }
          });
        } else {
          if (file.match(/(.*\.jpg|.*\.mov)/i)) {
            results.push(file);
          }
          if (!--pending) {
            done(null, results);
          }
        }
      });
    });
  });
}

function MediaTree(rootDir) {
  'use strict';

  this.find = function () {
    var deferred = when.defer(),
      hashPromises = [],
      filesByHash = {};
    MediaTree.findFiles(rootDir).then(function (files) {
      var i;
      console.log('found ' + files.length + ' media files');
      for (i = 0; i < files.length; i++) {
        hashPromises.push(MediaTree.hashFile(files[i]));
      }
      when.all(hashPromises).then(function (hashes) {
        console.log('when.all completing');
        for (i = 0; i < files.length; i++) {
          filesByHash[hashes[i]] = files[i];
        }
        console.log('about to resolve');
        deferred.resolve(filesByHash);
      }, deferred.reject);
    }, deferred.reject);
    return deferred.promise;
  };

}

MediaTree.findFiles = function (rootDir) {
  'use strict';
  var deferred = when.defer();

  walk(rootDir, function (err, files) {
    if (err) {
      deferred.reject(err);
      return;
    }
    deferred.resolve(files);
  });

  return deferred.promise;
};

MediaTree.hashFile = function (file) {
  'use strict';
  var deferred = when.defer(),
    shasum = crypto.createHash('md5'),
    s;

  s = fs.ReadStream(file);
  s.on('data', function (d) {
    shasum.update(d);
  });

  s.on('end', function () {
    var d = shasum.digest('hex');
    console.log(hashCount++ + ' - ' + file + ' - ' + d);
    deferred.resolve(d);
  });

  return deferred.promise;
};

module.exports = MediaTree;
