
define('ace/mode/praise',
  ['require', 'exports', 'module'],
  function (require, exports, module) {

    let praiseGrammar = {
      // Style model
      'Style': {
        'comment': 'comment',
         'atom': 'constant',
         'keyword': 'keyword',
         'this': 'keyword',
         'builtin': 'support',
         'operator': 'operator',
         'identifier': 'identifier',
         'property': 'constant.support',
         'number': 'constant.numeric',
         'string': 'string',
      },

      // Lexical model
      'Lex': {
        'comment': {
          'type': 'comment', 'tokens': [
            ['//', null],
            ['@', null],
            ['/*', '*/'],
          ],
        },
         'identifier': 'RE::/[_A-Za-z$][_A-Za-z0-9$]*/',
         'this': 'RE::/this\\b/',
         'property': 'RE::/[_A-Za-z$][_A-Za-z0-9$]*/',
         'number': [
          // floats
          'RE::/\\d*\\.\\d+(e[\\+\\-]?\\d+)?/',
          'RE::/\\d+\\.\\d*/',
          'RE::/\\.\\d+/',
          // integers
          // hex
          'RE::/0x[0-9a-fA-F]+L?/',
          // binary
          'RE::/0b[01]+L?/',
          // octal
          'RE::/0o[0-7]+L?/',
          // decimal
          'RE::/[1-9]\\d*(e[\\+\\-]?\\d+)?L?/',
          // just zero
          'RE::/0(?![\\dx])/',
        ],
         'string': {
          'type': 'escaped-block', 'escape': '\\', 'tokens':
            // start, end of string (can be the matched regex group ie. 1 )
            ['RE::/([\'"])/', 1],
        },
         'operator': {
          'tokens': [
            '=>', '<=>', '^', '/', '*', '+', '-', '<', 'and', 'or', 'not',
            '<=', '=', '!=', '>=', '>', ':', ',', '|', '->', '..',
          ],
        },
         'delimiter': {
          'tokens': [
            '(', ')', '[', ']', '{', '}', ',', '=', ';', '?', ':',
            '+=', '-=', '*=', '/=', '%=', '&=', '|=', '^=', '++', '--',
            '>>=', '<<=',
          ],
        },
         'atom': {
          'autocomplete': true, 'tokens': [
            'true', 'false',
            'null', 'undefined',
            'NaN', 'Infinity',
          ],
        },
         'keyword': {
          'autocomplete': true, 'tokens': [
            'for', 'all', 'there', 'exists', 'if', 'then', 'else', 'sort',
            'Unknown', 'constant', 'random', 'x', 'in', 'Boolean', 'Integer',
            'Real', 'String',
          ],
        },
         'builtin': {
          'autocomplete': true, 'tokens': [
            'Object', 'Function', 'Array', 'String',
            'Date', 'Number', 'RegExp', 'Math', 'Exception',
            'setTimeout', 'setInterval', 'parseInt', 'parseFloat',
            'isFinite', 'isNan', 'alert', 'prompt', 'console',
            'window', 'global', 'this',
          ],
        },

      },

      // Syntax model (optional)
      'Syntax': {

        'dot_property': {'sequence': ['.', 'property']},
        'praise': 'comment | number | string | regex | keyword | operator | atom', //  ((\'}\' | \')\' | this | builtin | identifier | dot_property) dot_property*)

      },

      // what to parse and in what order
      'Parser': [['praise']],
    };

    var AceGrammar = AceGrammar || window.AceGrammar;
    var praise_mode = AceGrammar.getMode(praiseGrammar);

    // enable user-defined code folding in the specification (new feature)
    praise_mode.supportCodeFolding = true;

    // enable syntax lint-like validation in the grammar
    praise_mode.supportGrammarAnnotations = true;

    // enable user-defined autocompletion (if defined)
    praise_mode.supportAutoCompletion = true;
    praise_mode.autocompleter.options = {prefixMatch: true, caseInsensitiveMatch: false};
    // or for context-sensitive autocompletion, extracted from the grammar
    praise_mode.autocompleter.options = {prefixMatch: true, caseInsensitiveMatch: false, inContext: true};
    // or for dynamic (context-sensitive) autocompletion, extracted from user actions
    praise_mode.autocompleter.options = {prefixMatch: true, caseInsensitiveMatch: false, inContext: true | false, dynamic: true};

    praise_mode.$id = 'ace/mode/praise';

    exports.Mode = praise_mode;
  });
