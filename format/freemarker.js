'use strict';
const formatFactory = require('./factory');
const abs = require('./abstract');
const invariant = require('invariant');

const Filter = function(node) {
  const args = node.args.children;
  const rest = args.length > 1
    ? '(' + args.slice(1)
        .map(arg => this.node(arg))
        .join(', ') + ')'
    : '';
  return [
    this.node(args[0]),
    this.FILTER_DELIM,
    this.node(node.name),
    rest
  ].join('');
};

const If = function(node) {
  invariant(this.K_IF, 'Encountered If without K_IF');
  invariant(this.K_END_IF, 'Encountered If without K_END_IF');

  const parts = [
    this.C_OPEN,
    this.K_IF, this.WS,
    this.node(node.cond),
    this.C_CLOSE,
    this.node(node.body)
  ];

  if (node.else_) {
    invariant(this.K_ELSE, 'Encountered If..Else without K_ELSE');
    // TODO: produce elseif expressions, rather than nested if/else
    parts.push(
      this.C_OPEN,
      this.K_ELSE,
      this.C_CLOSE,
      this.node(node.else_)
    );
  }
  return parts.concat([
    this.C_END_OPEN,
    this.K_END_IF,
    this.C_CLOSE
  ]).join('');
};

const For = function(node) {
  invariant(this.K_FOR, 'Encountered For..In without K_FOR');
  invariant(this.K_FOR_IN, 'Encountered For..In without K_FOR_IN');
  invariant(this.K_END_FOR, 'Encountered For..In without K_END_FOR');

  const parts = [
    this.C_OPEN,
    this.K_FOR, this.WS,
    this.node(node.arr), this.WS,
    this.K_FOR_IN, this.WS,
    this.node(node.name),
    this.C_CLOSE
  ];

  // TODO: node.else_

  return parts.concat([
    this.node(node.body),
    this.C_END_OPEN, 
    this.K_END_FOR,
    this.C_CLOSE
  ]).join('');
};

const Include = function(node) {
  return [
    this.C_OPEN,
    this.K_INCLUDE, this.WS,
    this.node(node.template),
    // TODO: support 'ignore missing'?
    this.C_CLOSE
  ].join('');
};

module.exports = formatFactory({
  WS:           ' ',
  K_IF:         'if',
  K_ELSE:       'else',
  K_ELSE_IF:    'elseif',       // NB: 'elseif' is also allowed
  K_END_IF:     'if',
  K_NOT:        'not',
  K_FOR:        'list',
  K_END_FOR:    'list',
  K_FOR_IN:     'as',
  K_BLOCK:      'block',
  K_END_BLOCK:  'endblock',
  // K_EXTENDS:    'extends', //no exteds in default free marker
  K_INCLUDE:    'include',
  K_SET:        'set',
  K_END_SET:    'endset',

  P_NUMERIC:    abs.P_NUMERIC,
  P_WORD:       abs.P_WORD,

  FILTER_DELIM: '?',

  C_OPEN:       '<#',
  C_END_OPEN:   '</#',
  C_CLOSE:      '>',
  O_OPEN:       '${',
  O_CLOSE:      '}',

  quote:        abs.quote,
  accessor:     abs.accessor,

  Add:          abs.Operator('+'),
  And:          abs.Operator('and'),
  Block:        abs.Block,
  Compare:      abs.Compare,
  Div:          abs.Operator('/'),
  Extends:      abs.Extends,
  Filter:       Filter,
  For:          For,
  Group:        abs.Group,
  If:           If,
  Include:      Include,
  Literal:      abs.Literal,
  LookupVal:    abs.LookupVal,
  Mul:          abs.Operator('*'),
  NodeList:     abs.NodeList,
  Not:          abs.Not,
  Or:           abs.Operator('or'),
  Output:       abs.Output,
  Root:         abs.NodeList,
  Set:          abs.Set,
  Sub:          abs.Operator('-'),
  Symbol:       abs.Symbol,
  TemplateData: abs.TemplateData
});