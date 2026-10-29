// MailZone forum design: five folders, compact stacked rows, and quoted message threads.
(function () {
  'use strict';
  env.widget({
    task: 'use-email',
    site: 'design-use-email-nl-02',
    name: 'design',
    split: 'train',
    scenarios: ['nl'],
    template: 'use-email/mail',
    design: {
      style: 'forum',
      decor: null,
      stack: true,
      rowHeight: 34,
      folderList: ['inbox', 'starred', 'important', 'archive', 'trash'],
      parts: {
        docContent: (base, S) => (d, e, i, m) => {
          const content = (d.content = S.el('div', 'message-content', S.els.docInside, e.body));
          for (let q = 0; q < 3; q++) {
            const quote = S.el('div', 'thread-quote', content);
            S.el('strong', '', quote, 'From: ' + (q % 2 ? S.spec.me.name : e.name));
            S.el('strong', '', quote, 'Date: ' + e.time);
            S.el('p', '', quote, e.body.split('\n').filter(Boolean).slice(1, 3).join(' '));
          }
          for (const a of e.att) S.P.attachment(content, a, e);
          S.sentNotes(content, i, m);
        },
        paintClasses: (base, S) => (m) => {
          base(m);
          S.els.root.classList.toggle('composing', !!m.compose);
          S.els.root.classList.toggle('opened', m.open !== null);
        },
        listKept: (base, S) => (m) => {
          base(m);
          const { ledger, lbx } = S.els;
          if (!S.visible(ledger)) return;
          lbx.set({ scroll: m.scroll || 0 });
          const scroll = Math.round(lbx.scrollIndex() * 1000) / 1000;
          if (scroll !== (S.ctx.model.scroll || 0)) S.ctx.update({ ...S.ctx.model, scroll });
        },
      },
    },
  });

})();
