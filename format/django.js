'use strict';
const abs = require('./abstract');
const jinja = require('./jinja');
const invariant = require('invariant');

const Filter = function(node) {
  const args = node.args.children;
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
 * This module extends the jinja syntax in order to cover 
 * the discrepancies between django template and jinja.
 * TODO: macros, implicit method calls, cycler
 */
module.exports = jinja.extend({
  K_FOR_ELSE:   'empty',
  Filter: Filter,
});
