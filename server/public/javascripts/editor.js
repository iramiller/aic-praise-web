var model = ace.edit('model');
var query = ace.edit('query');
var output = ace.edit('output');

var primus = Primus.connect('/', {
  reconnect: {
    max: Infinity,
    min: 500,
   retries: 10,
  },
});


model.setOptions({
  autoScrollqueryIntoView: true,
  highlightActiveLine: true,
  printMargin: false,
  theme: 'ace/theme/monokai',
});
model.getSession().setMode(ace.require('ace/mode/praise').Mode);

model.commands.addCommand({
  name: 'validateCode',
  bindKey: {win: 'Ctrl-Alt-D', mac: 'Command-Option-D'},
  exec: function(model) {
    if (primus.writable) {
      output.setValue('', 0);
      output.insert('Sending to server for validation.\n');
      primus.write({'command': 'validate', 'model': model.getValue()});
    } else {
      output.insert('Can not send data to server for processing.  Are you connected?\n');
    }
  },
  readOnly: true, // false if this command should not apply in readOnly mode
});

model.commands.bindKey('Shift-Enter', 'validateCode');


query.setOptions({
  maxLines: 1, // make it 1 line
  autoScrollqueryIntoView: true,
  highlightActiveLine: false,
  printMargin: false,
  showGutter: false,
  theme: 'ace/theme/monokai',
});
// remove newlines in pasted text
query.on('paste', function(e) {
  e.text = e.text.replace(/[\r\n]+/g, ' ');
});
// make mouse position clipping nicer
query.renderer.screenToTextCoordinates = function(x, y) {
  var pos = this.pixelToScreenCoordinates(x, y);
  return this.session.screenToDocumentPosition(
      Math.min(this.session.getScreenLength() - 1, Math.max(pos.row, 0)),
      Math.max(pos.column, 0)
  );
};

query.commands.addCommand({
  name: 'runCode',
  bindKey: {win: 'Ctrl-D', mac: 'Command-D'},
  exec: function(query) {
    if (primus.writable) {
      output.setValue('', 0);
      output.insert('// Sending to server for evaluation.\n');
      primus.write({'command': 'runsim', 'model': model.getValue(), 'query': query.getValue()});
    } else {
      output.insert('Can not send data to server for processing.  Are you connected?\n');
    }
  },
  readOnly: true, // false if this command should not apply in readOnly mode
});
query.commands.bindKey('Enter|Shift-Enter', 'runCode');


output.setOptions({
  autoScrollqueryIntoView: true,
  highlightActiveLine: false,
  printMargin: false,
  showGutter: false,
  theme: 'ace/theme/monokai',
});
output.getSession().setMode(ace.require('ace/mode/praise').Mode);

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
  output.insert('Reconnecting...\n');
});

primus.on('end', function() {
  output.insert('Connection closed.\n');
});

document.getElementById('runButton').addEventListener('click', function() {
  query.execCommand('runCode');
});

document.getElementById('validateButton').addEventListener('click', function() {
  model.execCommand('validateCode');
});

document.getElementById('clearButton').addEventListener('click', function() {
  output.setValue('', 0);
});
