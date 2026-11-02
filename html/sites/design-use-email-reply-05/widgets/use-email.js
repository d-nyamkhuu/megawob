// CityMail keeps Compose in the folder rail and uses a single-panel reply editor.
(function () {
  'use strict';

  env.widget({
    task: 'use-email',
    site: 'design-use-email-reply-05',
    name: 'design',
    split: 'train',
    scenarios: ['reply'],
    template: 'use-email/mail',
    design: {
      rowHeight: 56,
      folderList: ['inbox', 'sent', 'drafts', 'spam', 'trash'],
      newLabel: 'Compose',
      newIcon: 'pencil',
      newIn: 'folders',
      newClass: 'compose-btn',
      replyTitle: 'Reply',
      replyNamed: false,
      replyPlaceholder: '',
      forwardPlaceholder: '',
      cancelLabel: 'Save Draft',
      paths: { pencil: 'M4 20l1-5L16 4l4 4L9 19z M14 6l4 4' },
      parts: {
        icon: (base) => (k) =>
          k === 'pencil'
            ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 2h17v20H3z" fill="#f5f8fb" stroke="#9aa9b6"/><path d="m5 20 1-5L17 3l4 4L10 19z" fill="#f6c64c" stroke="#718398"/><path d="m17 3 2-1 3 3-1 2z" fill="#df7880" stroke="#718398"/><path d="m5 20 1-5 4 4z" fill="#636e7b" stroke="none"/></svg>'
            : base(k),
        docMade: (base, S) => () => {
          base();
          S.button(S.els.doc.querySelector('.window-title'), 'Back', 'back', { back: true }, null, 'source-back');
        },
        docBack: () => () => {},
        editorBody: (base) => (shown) => {
          const area = base(shown);
          area.placeholder = '';
          return area;
        },
        editorTitle: (base, S) => (shown) => {
          const title = S.el('div', 'window-title', S.els.editor, S.P.editorTitleText(shown));
          S.el('span', 'gadgets', title, '');
          return title;
        },
        editorTitleMade: (base, S) => (title, shown, composing) => {
          if (composing) {
            title.setAttribute('role', 'button');
            title.dataset.target = 'action:' + shown.mode;
            title.style.cursor = 'pointer';
            title.addEventListener('click', () => {
              if (!S.ctx.model.compose)
                S.up(shown.mode === 'forward' ? { forward: shown.of } : { reply: shown.of });
            });
            S.els.reg.set('action:' + shown.mode, title);
          }
          base(title, shown, composing);
        },
        cancelButton: (base, S) => (acts) =>
          S.button(acts, 'Save Draft', 'compose:discard', { discard: true }, null, 'draft'),
        paintClasses: (base, S) => (m) => {
          base(m);
          S.els.root.classList.toggle('recovering', S.fam.helpers.sideEffects(m, S.spec).length > 0);
        },
      },
    },
  });
})();
