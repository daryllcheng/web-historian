var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');
var fs = require('fs');
var urlParser = require('url');
// require more modules/folders here!

// var headers = {
//   'access-control-allow-origin': '*',
//   'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
//   'access-control-allow-headers': 'content-type, accept',
//   'access-control-max-age': 10, // Seconds.
//   'Content-Type': 'text/html'
// };

var headers = httpHelpers.headers;
// var serveAssets = httpHelpers.serveAssets;

var sendResponse = function(response, data, statusCode) {
  statusCode = statusCode || 200;
  response.writeHead(statusCode, headers);
  response.end(data);
};

var collectData = function(request, callback) {
  var data = '';
  request.on('data', function(chunk) {
    data += chunk;
  });
  request.on('end', function() {
    callback(data);
  });
};

var sendRedirect = function(response, location, status) {
  status = status || 302;
  response.writeHead(status, {Location: location});
  response.end();
};

var actions = {
  'GET': function(request, response) {
    var urlPath = urlParser.parse(request.url).pathname;
    //this gives us only the "path" following the host name  ie: www.google.com(/search)... ?q=somethingyouwant
    //                                                                             ^^^^ .pathname

    if (urlPath === '/') { urlPath = '/index.html'; }

    fs.readFile(archive.paths.siteAssets + urlPath, function(err, content) {
      if (err) {
        fs.readFile(archive.paths.archivedSites + urlPath, function(err, content) {
          if (err) {
            urlPath = urlPath.slice(1);
            archive.isUrlInList(urlPath, function(exists) {
              if (exists) {
                sendRedirect(response, '/loading.html');
              } else {
                sendResponse(response, null, 404);
              }
            })
          } else {
            sendResponse(response, content);
          }
        })
      } else {
        sendResponse(response, content);
      }
    });
  },

  'POST': function(request, response) {
    collectData(request, function(data) {
      var url = data.split('=')[1].replace('http://', '');

      archive.isUrlInList(url, function(exists) {
        if (exists) {
          archive.isUrlArchived(url, function(found) {
            if (found) {
              sendRedirect(response, '/' + url);
            } else {
              sendRedirect(response, '/loading.html');
            }
          });
        } else {
          archive.addUrlToList(url, function() {
            sendRedirect(response, '/loading.html'); 
          });
        }  
      });
    });
  },
  'OPTIONS': function(request, response) {
    sendResponse(response, null);
  }
};


exports.handleRequest = function (request, response) {
  // response.end(archive.paths.list);

  var action = actions[request.method];
  if (action) {
    action(request, response);
  } else {
    exports.sendResponse(response, '', 404);
  }



};
