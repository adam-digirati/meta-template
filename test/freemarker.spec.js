'use strict';
const format = require('../format');
const path = require('path');
const runSpec = require('./lib/run-spec');

runSpec(
  path.join(__dirname, 'freemarker.spec.yml'),
  format.freemarker
);
