// CityMail's reply design uses its compact rows, custom mail icons and root toolbar.
(function () {
  'use strict';
  function addRail(S, parent, target) {
    const rail = S.el('div', 'faux-scroll', parent);
    const up = S.el('button', '', rail, '▴');
    up.type = 'button';
    S.el('div', 'rail', rail);
    const down = S.el('button', '', rail, '▾');
    down.type = 'button';
    for (const [button, delta] of [[up, -40], [down, 40]])
      button.addEventListener('click', (ev) => {
        ev.stopPropagation();
        const scroll = target.querySelector?.('.message-content') || target;
        scroll.scrollTop += delta;
      });
  }
  const art = {
    new: '<path d="M6 3h12v18H6z" fill="url(#paper)"/><path d="M5 5H3v17h12v-1"/><path d="M8 6h7M8 8h7M8 10h7M8 12h7M8 14h7M8 16h5" stroke="#999dbc" stroke-width=".6"/>',
    reply: '<path d="M12 2 2 12l10 10v-6h9V8h-9z" fill="url(#violet)"/><path d="M12 3 3 12h9V9h8" stroke="#eeeaff" fill="none"/><path d="m17 13 4 5-7-2" fill="#6568ad"/>',
    replyall: '<path d="M9 2 1 12l8 10zM20 2 10 12l10 10z" fill="url(#violet)"/><path d="M9 3 2 12M20 3 11 12" stroke="#f6f3ff"/>',
    forward: '<path d="M13 2 23 12 13 22v-6H2V8h11z" fill="url(#violet)"/><path d="M13 3v6H3" stroke="#f5f2ff" fill="none"/>',
    move: '<path d="M2 5h8l3 4h9v12H2z" fill="url(#violet)"/><path d="M2 8h20v13H2z" fill="url(#violet)"/><path d="M3 5h6l3 4h9" stroke="#fff" fill="none"/>',
    delete: '<path d="M5 5h14l-1 17H6z" fill="url(#violet)"/><path d="M3 4h18v2H3zM8 2h8v2H8z" fill="url(#metal)"/><path d="M8 8v11M12 8v11M16 8v11" stroke="#3e4267"/><path d="M6 7v13" stroke="#dddfff"/>',
    print: '<path d="M7 2h10v8H7z" fill="url(#paper)"/><path d="M3 9h18v10H3z" fill="url(#metal)"/><path d="M7 15h10v7H7z" fill="url(#paper)"/><path d="M5 11h2M8 18h8" stroke="#45495d"/>',
  };
  env.widget({
    task: 'use-email',
    site: 'design-use-email-reply-04',
    name: 'design',
    split: 'train',
    scenarios: ['reply'],
    template: 'use-email/mail',
    design: {
      rowHeight: 32,
      folderList: ['inbox', 'sent', 'drafts', 'archive', 'junk', 'trash'],
      foldersTitle: 'Folders',
      toolbarIn: 'root',
      newLabel: 'New',
      toolbarAfter: [['Move', 'move'], ['Print', 'print']],
      paths: { print: 'M6 9V3h12v6 M6 18H3v-8h18v8h-3 M6 14h12v7H6z' },
      parts: {
        listStart: (base, S) => (m, order) => {
          base(m, order);
          S.els.ledger.classList.toggle('has-scroll', order.length > S.spec.rows);
        },
        docMade: (base, S) => () => {
          base();
          addRail(S, S.els.doc, S.els.docInside);
        },
        editorBody: (base, S) => (shown) => {
          const area = base(shown);
          addRail(S, S.els.editor, area);
          return area;
        },
        docMeta: (base, S) => (meta, email) => {
          S.el('h2', '', meta, email.subject);
          const from = S.el('div', 'meta-line', meta);
          S.el('span', 'meta-caption', from, 'From:');
          S.el('span', '', from, email.name);
          S.el('div', 'address', meta, '<' + email.addr + '>');
          const to = S.el('div', 'meta-line', meta);
          S.el('span', 'meta-caption', to, 'To:');
          S.el('span', '', to, S.spec.me.name + S.cc(email));
          S.el('div', 'address', meta, email.time);
        },
        editorTitleMade: (base, S) => (title) => {
          const gadgets = S.el('span', 'tb', title);
          for (const glyph of ['▾', '×']) S.el('span', 'window-gadget', gadgets, glyph);
          const motif = S.el('span', 'window-motif', title);
          motif.innerHTML = '<svg viewBox="0 0 16 18"><path d="M8 1 2 6h12zM8 17 2 12h12zM2 9h12"/></svg>';
        },
        editorFormat: (base, S) => () => {
          const format = S.el('div', 'formatbar', S.els.editor);
          S.el('span', 'text-mode', format, 'Plain Text');
          for (const [i, label] of ['B', 'I', 'U', '≡', '☰', '⁝'].entries()) {
            const tool = S.el('span', '', format, label);
            if (i > 2) {
              tool.textContent = '';
              const lines = i === 5
                ? '<circle cx="4" cy="5" r="1"/><circle cx="4" cy="10" r="1"/><circle cx="4" cy="15" r="1"/><path d="M8 5h10M8 10h10M8 15h10"/>'
                : i === 3
                  ? '<path d="M3 4h16M3 8h10M3 12h16M3 16h10"/>'
                  : '<path d="M3 4h16M9 8h10M3 12h16M9 16h10"/>';
              tool.innerHTML = '<svg viewBox="0 0 22 20">' + lines + '</svg>';
            }
          }
        },
        icon: (base) => (k) => {
          if (!art[k]) return base(k);
          return '<svg viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="violet" x2=".8" y2="1"><stop stop-color="#eeebff"/><stop offset=".45" stop-color="#9995ea"/><stop offset="1" stop-color="#494b92"/></linearGradient><linearGradient id="paper" x2="1" y2=".7"><stop stop-color="#fff"/><stop offset="1" stop-color="#c0c4db"/></linearGradient><linearGradient id="metal" x2="1" y2="1"><stop stop-color="#e5e8f1"/><stop offset=".5" stop-color="#a3a8bb"/><stop offset="1" stop-color="#626980"/></linearGradient></defs><g stroke="#4a4d69" stroke-width=".8" stroke-linejoin="miter">' + art[k] + '</g></svg>';
        },
        folderIcon: (base) => (v) => (v === 'trash' ? 'delete' : 'move'),
      },
    },
  });
})();
