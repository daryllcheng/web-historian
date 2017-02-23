var fs = require('fs');
var path = require('path');
var _ = require('underscore');

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
    // console.log('content', content);
    if (err) {
      callback(err, content);
    } else {
      callback(content.split('\n'));
    }
  });
};

exports.isUrlInList = function(url, callback) {
  fs.readFile(exports.paths.list, 'utf8', function(err, content) {
    // console.log('content', content);
    if (err) {
      callback(err, content);
    } else {
      callback((content.split('\n')).includes(url));
    }
  });
};

exports.addUrlToList = function(url, callback) {
  fs.readFile(exports.paths.list, 'utf8', function(err, content) {
    // console.log('content', content);
    if (err) {
      callback(err, content);
    }
    var body = content.split('\n');
    body.pop();
    body.push(url);
    var newBody = body.join('\n');
    // console.log(newBody);
    // console.log(url);
    callback(fs.writeFile(exports.paths.list, newBody));
  });
};

exports.isUrlArchived = function(url, callback) {
  fs.exists(exports.paths.archivedSites.concat('/' + url), function(exist) {
    callback(exist);
  });
};

exports.downloadUrls = function(urls) {
  for (let url of urls) {
    fs.writeFile(exports.paths.archivedSites + '/' + url, 'so much fun');
  }
};




