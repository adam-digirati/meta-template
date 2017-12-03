'use strict';
const format = require('../format');
const path = require('path');
const runSpec = require('./lib/run-spec');

runSpec(
  path.join(__dirname, 'django.spec.yml'),
  format.django
);
