var fs = require("fs");
var loaderUtils = require("loader-utils");
var SourceNode = require("source-map").SourceNode;
var SourceMapConsumer = require("source-map").SourceMapConsumer;

function getFileContents(filepath, callback) {
  if(filepath === undefined || filepath === '') {
    return callback(false);
  }
  fs.exists(filepath, function(exists) {
    if(!exists) {
      return callback(false);
    }
    fs.readFile(filepath, {encoding : 'utf8'}, function(err, data) {
      callback(err ? false : data);
    });
  });
}

module.exports = function(content, sourceMap) {
  if(this.cacheable) this.cacheable();
  var self = this;
  var callback = this.async();
  var query = loaderUtils.parseQuery(this.query);
  getFileContents(query.prefix, function(prefix) {
    getFileContents(query.postfix, function(postfix) {

      // Prepare delimier
      var delimiter = typeof query.delimiter === 'string' ? query.delimiter : '';
      
      // Prepare prefix
      if(prefix !== false) {
        self.addDependency(query.prefix);
        prefix = prefix + delimiter;
      } else {
        prefix = '';
      }
      
      // Prepare postfix
      if(postfix !== false) {
        self.addDependency(query.postfix);
        postfix = delimiter + postfix;
      } else {
        postfix = '';
      }

      // Build content
      if(sourceMap) {
        var currentRequest = loaderUtils.getCurrentRequest(self);
        var node = SourceNode.fromStringWithSourceMap(content, new SourceMapConsumer(sourceMap));
        node.prepend(prefix);
        node.add(postfix);
        var result = node.toStringWithSourceMap({
          file: currentRequest
        });
        callback(null, result.code, result.map.toJSON());
      } else {
        callback(null, prefix + content + postfix);
      }
    });
  });
}
