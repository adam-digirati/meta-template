'use strict';
const formatFactory = require('./factory');
const abs = require('./abstract');

const Filter = function(node) {
  const args = node.args.children;
  const rest = args.length > 1
    ? '(' + args.slice(1)
        .map(arg => this.node(arg))
        .join(', ') + ')'
    : '';
  return [
    this.node(args[0]), this.WS,
    this.FILTER_DELIM, this.WS,
    this.node(node.name),
    rest
  ].join('');
};

const Block = function(node) {
  return [
    this.C_OPEN, this.WS,
    this.K_BLOCK, this.WS,
    this.node(node.name), this.WS,
    this.C_CLOSE,
    this.node(node.body),
    this.C_OPEN, this.WS,
    this.K_END_BLOCK, this.WS,
    this.C_CLOSE,
  ].join('');
};

const Extends = function(node) {
  return [
    this.C_OPEN, this.WS,
    this.K_EXTENDS, this.WS,
    this.node(node.template), this.WS,
    this.C_CLOSE
  ].join('');
};

const Include = function(node) {
  return [
    this.C_OPEN, this.WS,
    this.K_INCLUDE, this.WS,
    this.node(node.template), this.WS,
    // TODO: support 'ignore missing'?
    this.C_CLOSE
  ].join('');
};

const Operator = (symbol) => {
  return function(node) {
    return [
      this.node(node.left),
      symbol,
      this.node(node.right)
    ].join(this.WS);
  };
};

module.exports = formatFactory({
  WS:           ' ',
  K_IF:         'if',
  K_ELSE:       'else',
  K_ELSE_IF:    'elif',       // NB: 'elseif' is also allowed
  K_END_IF:     'endif',
  K_FOR:        'for',
  K_END_FOR:    'endfor',
  K_FOR_IN:     'in',
  K_BLOCK:      'block',
  K_END_BLOCK:  'endblock',
  K_EXTENDS:    'extends',
  K_INCLUDE:    'include',

  C_OPEN:       '{%',
  C_CLOSE:      '%}',
  O_OPEN:       '{{',
  O_CLOSE:      '}}',

  P_NUMERIC:    abs.P_NUMERIC,
  P_WORD:       abs.P_WORD,

  FILTER_DELIM: '|',

  quote:        abs.quote,
  accessor:     abs.accessor,

  Add:          Operator('+'),
  Block:        Block,
  Compare:      abs.Compare,
  Extends:      Extends,
  Filter:       Filter,
  For:          abs.For,
  If:           abs.If,
  Include:      Include,
  Literal:      abs.Literal,
  LookupVal:    abs.LookupVal,
  NodeList:     abs.NodeList,
  Output:       abs.Output,
  Root:         abs.NodeList,
  Sub:          Operator('-'),
  Symbol:       abs.Symbol,
  TemplateData: abs.TemplateData
});
