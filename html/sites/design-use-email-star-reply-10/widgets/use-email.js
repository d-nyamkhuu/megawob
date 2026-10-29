// WebMail's stacked star/reply design uses a custom reply icon and sender-aligned message actions.
(function () {
  'use strict';
  let senderRow;

  env.widget({
    task: 'use-email',
    site: 'design-use-email-star-reply-10',
    name: 'design',
    split: 'train',
    scenarios: ['star-reply'],
    template: 'use-email/mail',
    design: {
      rowHeight: 118,
      paths: {
        reply: 'M9 5 3 11l6 6 M3 11h10c6 0 8 3 8 9',
      },
      parts: {
        folderAction: (base, S) => (v) => {
          const m = S.ctx.model;
          return v === (m.view || 'inbox') && (m.open !== null || m.compose) ? { back: true } : { view: v };
        },
        docMeta: (base, S) => (meta, e) => {
          const { el, cc } = S;
          el('h2', '', meta, e.subject);
          senderRow = el('div', 'sender-row', meta);
          el('div', 'avatar', senderRow, e.name.slice(0, 1).toUpperCase());
          const senderText = el('div', 'sender-text', senderRow);
          const from = el('div', 'from', senderText);
          el('strong', '', from, e.name);
          el('span', 'address', from, ' <' + e.addr + '>');
          el('div', 'to-line', senderText, 'to me' + cc(e) + ' ⌄');
          el('div', 'time-stamp', senderRow, e.time);
        },
        docActions: (base, S) => (d, e, i, m) => {
          base(d, e, i, m);
          senderRow.append(d.tools, d.acts);
          const more = S.el('button', 'more-actions', d.acts);
          more.type = 'button';
          more.title = 'More';
          more.setAttribute('aria-label', 'More');
          more.innerHTML =
            '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="5" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="12" cy="19" r="1.8"/></svg>';
          more.addEventListener('click', () => env.log('decoy', { label: 'More' }));
        },
        locateBack: (base, S) => (t) => {
          if (t.back) {
            const b = S.els.reg.get('back');
            return S.center(S.visible(b) ? b : S.els.folderButtons.get(S.ctx.model.view || 'inbox'));
          }
        },
      },
    },
  });
})();
