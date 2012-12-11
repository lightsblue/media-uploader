var MockDestination = function (indexJson) {
  'use strict';
  var when = require('when');

  this.loadRemoteIndex = function () {
    var deferred = when.defer();
    console.log('mock remote index loaded');
    deferred.resolve(indexJson);
    return deferred.promise;
  };

  this.upload = function (hashToFile) {
    var deferred = when.defer(),
      syncStats = {};
    console.log('mock uploading');
    syncStats.media = 99;
    deferred.resolve(syncStats);
    return deferred.promise;
  };
};

module.exports = MockDestination;
