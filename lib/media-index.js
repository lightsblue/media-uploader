var fs = require('fs'),
  when = require('when');

function MediaIndex(givenIndex) {
  'use strict';

  var index = givenIndex;

  this.filterPreviouslyUploaded = function (localHashToFile) {
    var localHash;
    for (localHash in localHashToFile) {
      if (localHashToFile.hasOwnProperty(localHash)) {
        if (typeof index[localHash] !== 'undefined') {
          delete localHashToFile[localHash];
        }
      }
    }
  };

}

module.exports = MediaIndex;
