import { Component, createSignal, onMount } from 'solid-js';

import styles from './App.module.css';

import * as monaco from 'monaco-editor';
import './scripts/monacoWorker';

let editor: HTMLElement | ((el: HTMLElement) => void);

const App: Component = () => {
  const [value, setValue] = createSignal('');

  const initialValue = value();

  (window as any).monaco = monaco;

  onMount(async () => {
    if (editor instanceof HTMLElement) {
      const monacoEditor = monaco.editor.create(editor, {
        value: value(),
        language: 'html',
        automaticLayout: true,
        lineNumbers: 'off',
        'semanticHighlighting.enabled': 'configuredByTheme',
        autoClosingBrackets: 'always',
        autoIndent: 'full',
        tabSize: 4,
        detectIndentation: false,
        useTabStops: true,
        minimap: {
          enabled: false,
        },
        scrollbar: {
          useShadows: true,
          horizontal: 'hidden',
          verticalScrollbarSize: 10,
          verticalSliderSize: 4,
        },
        folding: false,
        wrappingStrategy: 'advanced',
        wordWrap: 'on',
        bracketPairColorization: {
          enabled: true,
          independentColorPoolPerBracketType: true,
        },
        padding: {
          top: 12,
          bottom: 12,
        },
        fixedOverflowWidgets: true,
        tabCompletion: 'on',
        acceptSuggestionOnEnter: 'on',
        cursorWidth: 6,
        roundedSelection: true,
        matchBrackets: 'always',
        autoSurround: 'languageDefined',
        screenReaderAnnounceInlineSuggestion: false,
        renderFinalNewline: 'on',
        selectOnLineNumbers: false,
        formatOnType: true,
        formatOnPaste: true,
        fontWeight: '500',
        fontLigatures: true,
      });
    }
  });

  return (
    <div class={styles.App}>
      <div class="editor">
        <code ref={editor} />
      </div>
    </div>
  );
};

export default App;
