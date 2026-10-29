// Notebook mail with preferences, hidden task controls, and a reveal step before mail actions.
(function () {
  'use strict';
  env.widget({
    task: 'use-email',
    site: 'design-use-email-delete-12',
    name: 'design',
    split: 'train',
    scenarios: ['delete'],
    template: 'use-email/mail',
    design: {
      style: 'notebook',
      rowHeight: 49,
      folderList: ['compose', 'inbox', 'sent', 'drafts', 'archive', 'junk', 'trash'],
      toolbarAfter: [],
      parts: {
        snapped: (base, S) => () => {
          const { el, button, action, ctx } = S;
          const { root, contact, reg } = S.els;
          root.classList.add('controls-hidden');
          contact.querySelector('.window-title').firstChild.textContent = '3   Preferences';
          el('div', 'notebook-mail-title', root, '2   Mail');
          const pref = el('div', 'preferences', contact);
          for (const [name, value] of [
            ['Theme', 'Mint (default)'],
            ['Density', 'Comfortable'],
            ['Preview pane', 'Right'],
          ]) {
            const label = el('label', '', pref, name);
            const input = el('input', '', label);
            input.value = value;
            input.readOnly = true;
          }
          const box = el('section', 'control-box', root);
          el('h3', '', box, '4   Task controls');
          el('p', '', box, 'Controls are hidden to prevent accidental actions.');
          const reveal = el('button', 'reveal-control', box, 'Show controls');
          reg.set('reveal', reveal);
          reveal.addEventListener('click', () => {
            root.classList.remove('controls-hidden');
          });
          button(box, 'Delete', 'action:delete', () => action('delete', ctx.model.open ?? 0), 'delete', 'delete-control');
          button(box, 'Restore', 'action:inbox', () => action('inbox', ctx.model.open ?? 0), 'inbox', 'delete-control');
        },
        locateEarly: (base, S) => (t) => {
          const { root, reg } = S.els;
          if (root.classList.contains('controls-hidden') && (t.action || t.rowIcon))
            return S.center(reg.get('reveal'));
        },
      },
    },
  });
})();
