// Bauhaus mail with contact addresses, avatar headers and a quoted forwarding editor.
(function () {
  'use strict';
  env.widget({
    task: 'use-email',
    site: 'design-use-email-forward-06',
    name: 'design',
    split: 'train',
    scenarios: ['forward'],
    template: 'use-email/mail',
    design: {
      rowHeight: 60,
      forwardTitle: 'Forward',
      formatKeys: ['B', 'I'],
      parts: {
        contactMade: (base, S) => (b, p) => {
          base(b, p);
          S.el('span', 'contact-address', b, p.addr || '');
        },
        listStart: (base, S) => (m, order) => {
          base(m, order);
          S.els.ledger.classList.toggle('index-scrollable', order.length > S.spec.rows);
        },
        rowHead: (base) => (r, e, i) => {
          base(r, e, i);
          r.title = e.name + ' — ' + e.subject;
        },
        docMeta: (base, S) => (meta, e, i) => {
          const { el, button, action, cc } = S;
          el('h2', '', meta, e.subject);
          el('div', 'avatar', meta, e.name.split(/\s+/).map(w => w[0] || '').join('').slice(0, 2).toUpperCase());
          el('div', 'from-line', meta, e.name);
          el('div', 'address sender-address', meta, e.addr);
          el('div', 'recipient-meta', meta, 'To: ' + S.spec.me.name + cc(e));
          el('div', 'message-date', meta, e.time);
          const headerIcons = el('div', 'header-icons', meta);
          button(headerIcons, 'Star', null, () => action('star', S.ctx.model.open ?? i), 'star');
          button(headerIcons, 'Reply', null, () => action('reply', S.ctx.model.open ?? i), 'reply');
          el('span', 'more-icon', headerIcons, '⋮');
        },
        editorTitleMade: (base, S) => (title, shown, c) => {
          base(title, shown, c);
          if (c && shown.mode === 'forward') {
            title.setAttribute('role', 'button');
            title.dataset.target = 'action:' + shown.mode;
            title.style.cursor = 'pointer';
            title.addEventListener('click', () => S.up({ forward: shown.of }));
            S.els.reg.set('action:' + shown.mode, title);
          }
        },
        editorFormat: (base, S) => (shown) => {
          base(shown);
          const fmt = S.els.editor.querySelector('.formatbar');
          for (const path of [
            'M10 14l4-4 M8 16l-1 1a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0 M16 8l1-1a4 4 0 0 1 6 6l-5 5a4 4 0 0 1-6 0',
            'M8 5h13 M8 12h13 M8 19h13 M3 5h1 M3 12h1 M3 19h1',
            'M8 5h13 M8 12h13 M8 19h13 M2 3h2v4 M2 10h2v4 M2 17h2v4',
            'M8 7v10a4 4 0 0 0 8 0V5a3 3 0 0 0-6 0v11a1 1 0 0 0 2 0V7',
          ]) {
            const item = S.el('span', 'format-icon', fmt);
            item.innerHTML = '<svg viewBox="0 0 24 24"><path d="' + path + '"/></svg>';
          }
        },
        editorBody: (base, S) => (shown) => {
          const { el, spec } = S;
          const bodyPanel = el('div', 'forward-body', S.els.editor);
          if (shown.mode === 'forward') {
            const original = spec.emails[shown.of];
            const quoted = el('div', 'forward-header', bodyPanel);
            el('div', '', quoted, '---------- Forwarded message ----------');
            const from = el('div', '', quoted, 'From: ');
            el('strong', '', from, original.name);
            from.append(' <' + original.addr + '>');
            el('div', '', quoted, 'Date: ' + original.time);
            el('div', '', quoted, 'Subject: ' + original.subject);
            el('div', '', quoted, 'To: ' + spec.me.name);
          }
          const area = base(shown);
          bodyPanel.append(area);
          return area;
        },
        actionsMade: (base, S) => (acts, shown) => {
          base(acts, shown);
          S.button(S.els.editor.querySelector('.window-title'), 'Cancel', 'compose:discard',
            { discard: true }, 'close', 'composer-close');
        },
      },
    },
  });
})();
