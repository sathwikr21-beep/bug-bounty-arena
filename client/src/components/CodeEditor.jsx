import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';

export default function CodeEditor({ value, onChange, language }) {
  const extensions = language === 'html' ? [html()] : [javascript()];
  return (
    <CodeMirror
      value={value}
      height="340px"
      theme="dark"
      extensions={extensions}
      onChange={onChange}
      basicSetup={{ lineNumbers: true, foldGutter: false, autocompletion: false }}
    />
  );
}