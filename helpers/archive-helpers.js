var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('request')

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, 'utf8', function(err, content) {
    content = content.toString().split('\n');
    if (callback) {
      callback(content);
    }
  });
};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls(function(content) {
    // callback bool
    callback(content.includes(url));
  });
};

exports.addUrlToList = function(url, callback) {
  fs.appendFile(exports.paths.list, url + '\n', function(err, file) {
    callback();
  })  

};

exports.isUrlArchived = function(url, callback) {
  fs.exists(exports.paths.archivedSites.concat('/' + url), function(exist) {
    callback(exist);
  });
};

// exports.downloadUrls = function(urls) {
//   for (let url of urls) {
//     if (!url) { continue; };
//     fs.writeFile(exports.paths.archivedSites + '/' + url, request('http://' + url));
//   }
// };


exports.downloadUrls = function(urls) {
  // Iterate over urls and pipe to new files
  _.each(urls, function (url) {
    if (!url) { return; }
    request('http://' + url).pipe(fs.createWriteStream(exports.paths.archivedSites + '/' + url));
  });
};

