// Mac mail with gradient icons, a Move toolbar button, and labeled message metadata.
(function () {
  'use strict';
  let iconSerial = 0;
  const shades = {
    new: ['#fff5a0', '#d4a640'],
    reply: ['#c6e3ff', '#5294ce'],
    replyall: ['#c6e3ff', '#5294ce'],
    forward: ['#c6e3ff', '#5294ce'],
    delete: ['#b3bbc7', '#6e7887'],
    move: ['#fffba1', '#ead65c'],
  };
  const shapes = {
    new: '<path d="M2 22l2-6L17 3l4 4L8 20z"/><path d="m17 3 2-2q1-1 2 0l2 2q1 1 0 2l-2 2z" fill="#d59898"/><path d="m4 16 4 4-6 2z" fill="#fff5c4"/><path d="m2 22 1-3 2 2z" fill="#263448"/><path d="m6 17 12-12" stroke="#fff6c2"/>',
    delete: '<path d="M5 6h14l-1 15q-6 2-12 0z"/><path d="M3 5q9-2 18 0v2H3z" fill="#a5adbb"/><path d="M8 4V2q4-2 8 0v2" fill="none"/><path d="M8 9v10m4-10v10m4-10v10" fill="none"/>',
    move: '<path d="M2 5q0-2 2-2h6l3 3h8q1 0 1 2v13H2z"/><path d="M3 8h18v12H3z" fill="#fff397" stroke="none"/><path d="M3 20V8h18" fill="none" stroke="#fffdd0"/>',
  };
  env.widget({
    task: 'use-email',
    site: 'design-use-email-delete-08',
    name: 'design',
    split: 'train',
    scenarios: ['delete'],
    template: 'use-email/mail',
    design: {
      rowHeight: 45.6,
      rowBasis: 'size',
      newLabel: 'Compose',
      paths: { new: 'M4 20l1-4L16 5l3 3L8 19z M14 7l3 3 M4 20l4-1' },
      toolbarOps: [['Reply', 'reply'], ['Reply All', 'replyall'], ['Forward', 'forward'], ['Delete', 'delete'], ['Move', 'move']],
      toolbarAfter: [],
      parts: {
        icon: (base, S) => (k) => {
          const id = 'mail-icon-' + k + '-' + iconSerial++;
          const s = shades[k];
          const shape = shapes[k] || '<path d="' + (S.paths[k] || S.paths.mail) + '"/>';
          return '<svg viewBox="0 0 24 24" aria-hidden="true">' +
            (s ? '<defs><linearGradient id="' + id + '" x2=".4" y2="1"><stop stop-color="' + s[0] +
              '"/><stop offset="1" stop-color="' + s[1] + '"/></linearGradient></defs><g fill="url(#' + id +
              ')" stroke="#354052" stroke-width="1" stroke-linejoin="round">' + shape + '</g>' : shape) + '</svg>';
        },
        occupiedKeep: (base, S) => (v) => base(v) && !v.classList.contains('toolbar'),
        docMeta: (base, S) => (meta, e) => {
          const { el } = S;
          const dt = S.els.doc.querySelector('.window-title');
          if (dt && dt.firstChild) dt.firstChild.nodeValue = e.subject;
          el('h2', '', meta, e.subject);
          const mrow = (k, v) => {
            const d = el('div', 'mrow', meta);
            el('b', '', d, k);
            el('span', '', d, v);
          };
          mrow('From:', e.name + ' <' + e.addr + '>');
          mrow('To:', S.spec.me.name + S.cc(e));
          mrow('Date:', e.time);
        },
      },
    },
  });
})();
