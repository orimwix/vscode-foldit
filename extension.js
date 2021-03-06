var vscode = require('vscode');

const METHODS_TO_FOLD_CONFIG_NAME = 'methodsToFold';

function activate(context) {
  var disposable = vscode.commands.registerCommand('foldit.fold', foldCommand);
  context.subscriptions.push(disposable);
}

function foldCommand() {
  const methodsToFold = vscode.workspace
    .getConfiguration('foldIt')
    .get(METHODS_TO_FOLD_CONFIG_NAME);

  const editor = vscode.window.activeTextEditor;

  const initialPosition = editor.selection.active.line;

  methodsToFold.forEach(l => foldByMethodName(editor, l));
  moveCursorTo(editor, initialPosition);
}

function foldByMethodName(editor, methodName) {
  const itLines = findLineNumbersByString(editor.document, methodName);

  itLines.forEach(l => foldLine(editor, l));
}

function foldLine(editor, lineNum) {
  moveCursorTo(editor, lineNum);
  vscode.commands.executeCommand('editor.fold');
}

function findLineNumbersByString(doc, specMethodName) {
  const text = doc.getText();
  const itRegEx = new RegExp(`${specMethodName}\\s*\\(`);

  return text
    .split(/\r?\n/)
    .map((line, i) => [line, i])
    .filter(([line, i]) => itRegEx.test(line))
    .map(([line, i]) => i);
}

function moveCursorTo(editor, lineNum) {
  const position = editor.selection.active;

  var newPosition = position.with(lineNum, 0);
  var newSelection = new vscode.Selection(newPosition, newPosition);
  editor.selection = newSelection;
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = { activate, deactivate };
