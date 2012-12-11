var fs = require('fs'),
  when = require('when');

function MediaIndex(source, destination) {
  'use strict';

  // the local index
  var loadRemoteIndex,
    index;

  // load the remote destination index - i.e. the files that have already been
  // uploaded some time prior
  loadRemoteIndex = function loadRemoteIndex() {
    var deferred = when.defer();

    // TODO do the actual loading of remote index
    when.chain(destination.loadRemoteIndex(), deferred);

    return deferred.promise;
  };

  index = loadRemoteIndex();

  ////////////////////////////////////////////////////////////////////////////////
  //
  // Given a local hash-to-file map, filter it based on what's already in
  // this index
  //
  ////////////////////////////////////////////////////////////////////////////////
  this.filterPreviouslyUploaded = function (localHashToFile) {

    // get the hashes to all files in source
    var deferred = when.defer();

    when.all([localHashToFile, index]).then(function (results) {
      try {
        var localHash,
          localHashToFile = results[0],
          index = results[1];
        for (localHash in localHashToFile) {
          if (localHashToFile.hasOwnProperty(localHash)) {
            if (typeof index[localHash] !== 'undefined') {
              delete localHashToFile[localHash];
            }
          }
        }
        console.log('local files filtered');
        deferred.resolve(localHashToFile);
      } catch (err) {
        deferred.reject(err);
      }
    }, deferred.reject);
    return deferred.promise;
  };

  ////////////////////////////////////////////////////////////////////////////////
  //
  // Upload all unindexed media.
  //
  ////////////////////////////////////////////////////////////////////////////////
  this.uploadUnindexed = function () {
    var deferred = when.defer(),
      syncStats = {},
      toUpload;
    toUpload = this.filterPreviouslyUploaded(source.find());
    when(toUpload).then(function () {
      when.chain(destination.upload(toUpload), deferred);
    }, deferred.reject);
    return deferred.promise;
  };

}

module.exports = MediaIndex;
