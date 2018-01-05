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
editor.getSession().setMode(ace.require('ace/mode/praise').Mode);
editor.commands.addCommand({
  name: 'runCode',
  bindKey: {win: 'Ctrl-D', mac: 'Command-D'},
  exec: function(editor) {
    if (primus.writable) {
      output.insert('Sending to server for evaluation.\n');
      primus.write({'command': 'runsim', 'value': editor.getValue()});
    } else {
      output.insert('Can not send data to server for processing.  Are you connected?\n');
    }
  },
  readOnly: true, // false if this command should not apply in readOnly mode
});
editor.commands.bindKey('Shift-Enter', 'runCode');

editor.commands.addCommand({
  name: 'validateCode',
  bindKey: {win: 'Ctrl-Alt-D', mac: 'Command-Option-D'},
  exec: function(editor) {
    if (primus.writable) {
      output.insert('Sending to server for validation.\n');
      primus.write({'command': 'validate', 'value': editor.getValue()});
    } else {
      output.insert('Can not send data to server for processing.  Are you connected?\n');
    }
  },
  readOnly: true, // false if this command should not apply in readOnly mode
});

editor.commands.addCommand({
  name: 'clearOutput',
  bindKey: {win: 'Ctrl-Alt-X', mac: 'Command-Option-X'},
  exec: function(editor) {
      output.setValue('', 0);
  },
  readOnly: true, // false if this command should not apply in readOnly mode
});

output.setTheme('ace/theme/monokai');
output.setShowPrintMargin(false);
output.setReadOnly(true);
output.renderer.setShowGutter(false);
output.$blockScrolling = Infinity;
output.getSession().setMode('ace/mode/scheme');

primus.on('open', function open() {
  output.insert('Connected.\n');
});

primus.on('data', function message(data) {
  output.insert(data);
  output.insert('\n');
});

primus.on('error', function error(err) {
  output.insert('An error occured:');
  output.insert(err.stack);
  output.insert('\n');
});

primus.on('reconnect', function error(err) {
  output.insert('Connection lost, reconnecting...\n');
});

primus.on('end', function() {
  output.insert('Connection closed.\n');
});

document.getElementById('runButton').addEventListener('click', function() {
  editor.execCommand('runCode');
});

document.getElementById('validateButton').addEventListener('click', function() {
  editor.execCommand('validateCode');
});

document.getElementById('clearButton').addEventListener('click', function() {
  editor.execCommand('clearOutput');
});
