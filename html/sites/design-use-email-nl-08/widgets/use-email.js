// IRIX mail with taller stage-scaled rows, extra reply tools, SVG format icons and a Save Draft control.
(function () {
  'use strict';
  env.widget({
    task: 'use-email',
    site: 'design-use-email-nl-08',
    name: 'design',
    split: 'train',
    scenarios: ['nl'],
    template: 'use-email/mail',
    design: {
      rowHeight: 129,
      rowBasis: 'stage',
      formatKeys: ['B', 'I', 'U'],
      replyPlaceholder: 'Type your reply here...',
      parts: {
        docFlags: (base, S) => (m, i) => {
          const { docInside, doc, root } = S.els;
          if (!docInside.querySelector('.reference-reply')) {
            const tools = docInside.querySelector('.doc-tools');
            S.button(tools, 'Reply', null, () => S.action('reply', S.ctx.model.open ?? i), 'reply', 'reference-reply');
            const more = S.button(tools, 'More actions', null, null, null, 'reference-more');
            more.innerHTML =
              '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="4" cy="12" r="2.2"/><circle cx="12" cy="12" r="2.2"/><circle cx="20" cy="12" r="2.2"/></svg>';
            more.addEventListener('click', () => doc.classList.toggle('expanded-tools'));
          }
          doc.classList.toggle('reference-tools', ['reply', 'star-reply'].includes(S.spec.task));
          root.classList.toggle('management-task', !['reply', 'star-reply', 'forward'].includes(S.spec.task));
          base(m, i);
        },
        editorFormat: (base, S) => (shown) => {
          base(shown);
          const fmt = S.els.editor.querySelector('.formatbar');
          S.el('span', '', fmt).innerHTML =
            '<svg viewBox="0 0 28 28" aria-hidden="true"><path d="M10 6h15M10 14h15M10 22h15"/><circle cx="4" cy="6" r="1.5"/><circle cx="4" cy="14" r="1.5"/><circle cx="4" cy="22" r="1.5"/></svg>';
          S.el('span', '', fmt).innerHTML =
            '<svg viewBox="0 0 28 28" aria-hidden="true"><path d="m11 17 6-6m-8 4-2 2a5 5 0 0 0 7 7l5-5a5 5 0 0 0 0-7m0 1 2-2a5 5 0 0 0-7-7l-5 5a5 5 0 0 0 0 7"/></svg>';
        },
        cancelMade: (base, S) => (acts, shown) => {
          base(acts, shown);
          const draft = S.button(acts, 'Save Draft', null, null, null, 'save-draft');
          draft.addEventListener('click', () => env.log('decoy', { label: 'Save Draft' }));
        },
        editorMade: (base, S) => (m, shown, c) => {
          base(m, shown, c);
          const { editor } = S.els;
          editor.classList.toggle('reply-form', shown.mode === 'reply');
          editor.classList.toggle(
            'needs-address',
            shown.mode !== 'reply' || shown.to !== S.spec.emails[shown.of ?? 0].name || !!shown.cc,
          );
          editor.classList.toggle('can-discard', !!c);
        },
      },
    },
  });
})();
