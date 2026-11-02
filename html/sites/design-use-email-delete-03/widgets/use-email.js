// Mac mail design with blue action icons, sender emphasis, message sizes and extra toolbar controls.
(function () {
  'use strict';
  env.widget({
    task: 'use-email',
    site: 'design-use-email-delete-03',
    name: 'design',
    split: 'train',
    scenarios: ['delete'],
    template: 'use-email/mail',
    design: {
      rowBasis: 'size',
      newLabel: 'New',
      paths: { new: 'M3 5h18v14H3z M3 5l9 7 9-7' },
      toolbarAfter: [
        ['Print', 'file'],
        ['Move To', 'move', 'toolbar-xtra move-xtra'],
        ['More', null, 'toolbar-xtra more-xtra'],
      ],
      searchPlaceholder: 'Search mail',
      columns: ['From', 'Subject', 'Received', 'Size'],
      parts: {
        begin: (base, S) => () => {
          base();
          const instruction = document.querySelector('.task-note .instruction');
          if (instruction) {
            const text = instruction.textContent;
            const names = S.spec.emails.flatMap((e) => [e.name, e.name.split(' ')[0]]).sort((a, b) => b.length - a.length);
            const name = names.find((n) => n.length > 2 && text.includes(n));
            if (name) {
              const at = text.indexOf(name);
              instruction.replaceChildren();
              instruction.append(document.createTextNode(text.slice(0, at)));
              S.el('em', 'sender-name', instruction, name);
              instruction.append(document.createTextNode(text.slice(at + name.length)));
            }
          }
        },
        icon: (base, S) => (k) => {
          const blue = ['reply', 'replyall', 'forward'].includes(k);
          return '<svg viewBox="0 0 24 24" aria-hidden="true">' +
            (blue ? '<defs><linearGradient id="mail-blue-' + k +
              '" x2="0" y2="1"><stop stop-color="#2298db"/><stop offset=".52" stop-color="#087ac4"/><stop offset="1" stop-color="#005395"/></linearGradient></defs>' : '') +
            '<path ' + (blue ? 'style="fill:url(#mail-blue-' + k + ');stroke:#086bad" ' : '') +
            'd="' + (S.paths[k] || S.paths.mail) + '"/>' +
            (k === 'move' ? '<path fill="#4b6a84" stroke="#37556b" d="m3 11 19-1-3 11H1z"/>' : '') + '</svg>';
        },
        listStart: (base, S) => (m, order) => {
          base(m, order);
          S.els.listWrap.classList.toggle('has-overflow', order.length > S.spec.rows);
        },
        rowFlagsStart: (base, S) => (flags, e, i) => {
          base(flags, e, i);
          S.el('span', 'size', flags, ((i * 53) % 190 + 9) + ' KB');
        },
        docMeta: (base, S) => (meta, e) => {
          S.el('h2', '', meta, e.subject);
          S.el('div', '', meta, e.name);
          S.el('div', 'address', meta, '<' + e.addr + '>');
          S.el('div', '', meta, 'To: me' + S.cc(e));
          S.el('div', 'address', meta, e.time);
        },
      },
    },
  });
})();
