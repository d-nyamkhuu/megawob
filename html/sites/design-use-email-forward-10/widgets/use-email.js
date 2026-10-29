// Bauhaus mail with compact rows, an inbox count, address details and a forward editor with the original header.
(function () {
  'use strict';
  env.widget({
    task: 'use-email',
    site: 'design-use-email-forward-10',
    name: 'design',
    split: 'train',
    scenarios: ['forward'],
    template: 'use-email/mail',
    design: {
      rowHeight: 40,
      folderList: ['inbox', 'sent', 'drafts', 'trash', 'junk'],
      folderLabels: { trash: 'Deleted Items' },
      toolbarIn: 'folders',
      newLabel: 'Compose',
      searchPlaceholder: 'Search mail',
      forwardTitle: 'Forward',
      parts: {
        contactMade: (base) => (b, p) => {
          base(b, p);
          if (p.addr) b.querySelector('span').textContent = p.name + ' <' + p.addr + '>';
        },
        rowHeightPx: (base, S) => (avail) => Math.min(
          Math.floor(Math.max(22, S.D.rowHeight * innerWidth / 1672)),
          Math.max(1, Math.floor(avail / S.spec.rows)),
        ),
        listSized: (base, S) => (m, order, rowH, avail) => {
          base(m, order, rowH, avail);
          S.els.listWrap.classList.toggle('has-overflow', order.length * rowH > rowH * S.spec.rows);
        },
        paintFolders: (base, S) => (m) => {
          base(m);
          const inbox = S.els.folderButtons.get('inbox');
          if (inbox) inbox.querySelector('span').textContent = 'Inbox (' + m.box.filter(x => x === 'inbox').length + ')';
        },
        docMeta: (base, S) => (meta, e) => {
          const { el, spec } = S;
          el('h2', '', meta, e.subject);
          const mline = (k, v, bold) => {
            const d = el('div', 'mline', meta);
            el('span', 'k', d, k);
            const s = el('span', 'v', d);
            if (bold) {
              el('strong', '', s, e.name);
              s.append(' <' + e.addr + '>');
            } else s.textContent = v;
          };
          mline('From:', '', true);
          mline('To:', spec.me.name + (spec.me.addr ? ' <' + spec.me.addr + '>' : '') + S.cc(e));
          mline('Date:', e.time);
        },
        editorBody: (base, S) => (shown) => {
          const { el, spec } = S;
          const bodyBox = el('div', 'editor-body', S.els.editor);
          if (shown.mode === 'forward') {
            const original = spec.emails[shown.of ?? 0];
            el('div', 'original-header', bodyBox,
              '-------- Original Message --------\nFrom: ' + original.name + ' <' + original.addr +
              '>\nDate: ' + original.time + '\nSubject: ' + original.subject + '\nTo: ' + spec.me.name +
              (spec.me.addr ? ' <' + spec.me.addr + '>' : ''),
            );
          }
          const area = el('textarea', '', bodyBox);
          area.placeholder = shown.mode === 'forward' ? 'Forwarded message' : 'Write your reply…';
          area.spellcheck = false;
          S.els.fields.body = env.ui.textField(area, {
            value: shown.body || '',
            label: 'body',
            onInput: v => S.field('body', v),
          });
          S.els.reg.set('field:body', area);
          return area;
        },
        cancelButton: (base, S) => (acts) =>
          S.button(acts, 'Cancel', 'compose:discard', { discard: true }, null, 'discard'),
        cancelMade: (base, S) => (acts, shown) => {
          base(acts, shown);
          const draft = S.button(acts, 'Save Draft', null, null, null, 'draft');
          draft.addEventListener('click', () => env.log('decoy', { label: 'Save Draft' }));
          const attach = S.button(acts, 'Add Attachment', null, null, null, 'add-attachment');
          attach.addEventListener('click', () => env.log('decoy', { label: 'Add Attachment' }));
        },
      },
    },
  });
})();
