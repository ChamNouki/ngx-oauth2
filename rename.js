const fs = require('fs');
const package = require('./package.json');

const oldName = './dist.tgz';
const newName = `./${package.name}-${package.version}.tgz`;

fs.renameSync(oldName, newName);
