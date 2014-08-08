var path = require('path'),
    packagejson = require('../package.json');

module.exports = {
  version: packagejson.version,
  root: path.resolve('./'),
  shim: {}
};

