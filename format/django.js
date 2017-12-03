'use strict';
const abs = require('./abstract');
const jinja = require('./jinja');
const invariant = require('invariant');

const Filter = function(node) {
  const args = node.args.children;
  console.log(args, args.length > 2);
  invariant(args.length <= 2, "No multi argument filters in Django templates");
  const rest = args.length > 1
    ? ':' + this.node(args[1])
    : '';
  return [
    this.node(args[0]), this.WS,
    this.FILTER_DELIM, this.WS,
    this.node(node.name),
    rest
  ].join('');
};

/**
 * Nunjucks is supposed to be a drop-in replacement for Jinja2,
 * which is written in Python. In order to produce Jinja-compatible
 * output, we need to alias some JS-specific operators and constants.
 */
module.exports = jinja.extend({
  Filter: Filter
});
