import { Component, createEffect, createSignal, onMount, on } from 'solid-js';

import './App.css';

import * as monaco from 'monaco-editor';
import * as monacoThemeDark from 'monaco-themes/themes/Blackboard.json';
import './scripts/monacoWorker';

import { createForm, required, SubmitHandler } from '@modular-forms/solid';

let editor: HTMLElement | ((el: HTMLElement) => void);

type EditForm = {
  content: string;
  contentHidden: string;
};

const App: Component = () => {
  const fieldId = self.crypto.randomUUID();
  const fieldIdHidden = self.crypto.randomUUID();

  const [value, setValue] = createSignal(`
    <div>
      <p>This is just some sample html.</p>
    </div>
  `);

  const initialValue = value();

  const [editForm, { Form, Field }] = createForm<EditForm>();

  const formUpdate: SubmitHandler<EditForm> = (values, event) => {
    console.log(values);
    console.log(event);
  };

  (window as any).monaco = monaco;

  monaco.editor.defineTheme(
    'dark',
    monacoThemeDark as monaco.editor.IStandaloneThemeData
  );

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
        theme: 'dark',
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

      monacoEditor.getModel()?.onDidChangeContent(() => {
        setValue(monacoEditor.getModel()?.getValue() ?? '');
      });

      /**
       * Issue 1: When you enter text and the value is changed you have to trigger the input event on the element.
       * This is done with createEffect. I don't know if I'm doing something wrong here or the value() should bind differently.
       */
      createEffect(
        on(
          value,
          (value) => {
            monacoEditor.getModel()?.setValue(value);

            // Visible Field
            document
              .getElementById(fieldId)
              ?.dispatchEvent(new Event('input', { bubbles: true }));

            // Hidden Field
            document
              .getElementById(fieldIdHidden)
              ?.dispatchEvent(new Event('input', { bubbles: true }));
          },
          { defer: false }
        )
      );

      /**
       * Issue 2: You have a required hidden field that also uses validation, but it is not shown when the value is changed, even if you do the input event.
       */
    }
  });

  return (
    <div class="main">
      <div class="editor">
        <code ref={editor} />

        <Form method="post" onSubmit={formUpdate}>
          <div>
            <Field
              name="content"
              validate={[required(`Please enter some HTML.`)]}
            >
              {(field, props) => (
                <>
                  <input
                    {...props}
                    value={value()}
                    id={fieldId}
                    type="text"
                    required
                  />
                  {field.error && (
                    <>
                      <span class="error">{field.error}</span>
                    </>
                  )}
                </>
              )}
            </Field>
          </div>
          <div>
            <Field
              name="contentHidden"
              validate={[required(`Please enter some HTML.`)]}
            >
              {(field, props) => (
                <>
                  <input
                    {...props}
                    value={value()}
                    id={fieldIdHidden}
                    /**
                     * If you change the type to text the validation is triggered.
                     */
                    type="hidden"
                    required
                  />
                  {field.error && (
                    <>
                      <span class="error">{field.error}</span>
                    </>
                  )}
                </>
              )}
            </Field>
          </div>

          <button type="submit">Save</button>
        </Form>
      </div>
    </div>
  );
};

export default App;
