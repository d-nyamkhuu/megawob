// Amiga Workbench design with the reply paper, scrollbar rail, and editor decoy controls.
(function () {
  'use strict';
  env.widget({
    task: 'use-email',
    site: 'design-use-email-star-reply-06',
    name: 'design',
    split: 'train',
    scenarios: ['star-reply'],
    template: 'use-email/mail',
    design: {
      rowHeight: 39,
      foldersTitle: 'Folders',
      replyPlaceholder: '',
      forwardPlaceholder: '',
      sendIcon: null,
      parts: {
        rootDecor: (base, S) => (ctx) => {
          base(ctx);
          const depth = S.el('div', 'depth-gadget', S.els.root);
          depth.innerHTML = '<i></i><i></i>';
          const gadgets = S.el('div', 'workbench-gadgets', S.els.root);
          for (const glyph of ['−', '▱', '✣']) S.el('span', '', gadgets, glyph);
        },
        listStart: (base, S) => (m, order) => {
          base(m, order);
          S.els.listWrap.classList.toggle('mailbox-scrollable', order.length > S.spec.rows);
        },
        editorBody: (base, S) => (shown) => {
          const area = base(shown);
          const paper = S.el('div', 'reply-paper', S.els.editor);
          area.parentNode.insertBefore(paper, area);
          paper.appendChild(area);
          const rail = S.el('div', 'reply-scroll', paper);
          for (const [glyph, dy] of [['▲', -40], ['▼', 40]]) {
            const arrow = S.el('button', '', rail, glyph);
            arrow.type = 'button';
            arrow.setAttribute('aria-label', dy < 0 ? 'Scroll reply up' : 'Scroll reply down');
            arrow.addEventListener('click', () => {
              area.scrollTop += dy;
            });
          }
          return area;
        },
        cancelButton: (base, S) => (acts) => {
          S.button(acts, 'Cancel', 'compose:discard', { discard: true }, null, 'cancel-compose');
          const draft = S.button(acts, 'Save Draft', null, null, null, 'save-draft');
          draft.addEventListener('click', () => env.log('decoy', { label: 'Save Draft' }));
        },
      },
    },
  });
})();
