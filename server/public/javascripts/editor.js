var editor = ace.edit('editor');
var output = ace.edit('output');
var primus = Primus.connect('/', {
  reconnect: {
    max: Infinity,
    min: 500,
   retries: 10,
  },
});


editor.setTheme('ace/theme/monokai');
editor.setShowPrintMargin(false);
editor.getSession().setMode('ace/mode/scheme');

editor.commands.addCommand({
  name: 'runCode',
  bindKey: {win: 'Ctrl-D',  mac: 'Command-D'},
  exec: function(editor) {
      // capture editor contents.  Send to server for processing.
      // TODO - handle disconnected state, errors, etc.
      output.insert('Sending to server for evaluation.\n');
      primus.write({'command': 'runsim', 'value': editor.getValue()});
  },
  readOnly: true, // false if this command should not apply in readOnly mode
});


output.setTheme('ace/theme/monokai');
output.setShowPrintMargin(false);
output.setReadOnly(true);
output.renderer.setShowGutter(false);
output.getSession().setMode('ace/mode/scheme');

primus.on('open', function open() {
  output.insert('Connected.\n');
});

primus.on('data', function message(data) {
  output.insert(data);
  output.insert('\n');
});

primus.on('error', function error(err) {
  output.insert('An error occured:', err.stack);
});

primus.on('end', function() {
  output.insert('Connection closed.\n');
});

document.getElementById('runButton').addEventListener('click', function() {
  editor.execCommand('runCode');
});
