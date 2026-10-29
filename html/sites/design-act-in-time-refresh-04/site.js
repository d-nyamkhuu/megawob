(function () {
  'use strict';
  const C = { site: 'design-act-in-time-refresh-04' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, 'Mail Organizer');
      let submit = null,
        placement = null,
        label = 'Save';
      const makeSubmit = (parent, cls) => {
        const b = u.el('button', cls, parent);
        b.textContent = label;
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      if (!ctx.finish) {
        const fallback = [
          'Submit',
          'Done',
          'Finish',
          'Continue',
          'Save',
          'OK',
          'Confirm',
          'Apply',
          'Complete',
          "I'm done",
        ];
        const labels =
          ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
            ? ctx.content.END_LABELS
            : fallback;
        const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        const er = ctx.rng.fork('chrome/end');
        const original = er.bool(0.5);
        label = original ? 'Save' : labelOf(er.pick(labels));
        placement = original ? 'footer' : er.pick(['footer', 'title', 'status']);
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const pool = labels.map(labelOf).filter((x) => String(x).trim().toLowerCase() !== label.trim().toLowerCase());
          if (pool.length) {
            const d = u.el('button', 'ds-pq', top, String(cr.pick(pool)));
            d.type = 'button';
            d.dataset.role = 'xtra';
            d.addEventListener('click', () => env.log('decoy', { label: d.textContent, collide: true }));
          }
        }
        if (placement === 'title') submit = makeSubmit(top, 'ds-submit ds-submit-title');
      }
      const menu = u.el('nav', 'ds-menu', document.body);
      ['File', 'Edit', 'View', 'Message', 'Tools', 'Help'].forEach((t) => u.el('span', '', menu, t));
      const toolbar = u.el('div', 'ds-toolbar', document.body);
      [
        ['✉', 'New Message'],
        ['↶', 'Reply'],
        ['↶', 'Reply All'],
        ['➜', 'Forward'],
        ['✖', 'Delete'],
        ['▣', 'Move⌄'],
        ['◆', 'Label⌄'],
        ['▤', 'Print'],
      ].forEach(([i, t]) => {
        const b = u.el('div', 'ds-tool', toolbar);
        u.el('b', '', b, i);
        u.el('span', '', b, t);
      });
      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      [
        ['📥', 'Inbox'],
        ['▤', 'Sent'],
        ['📁', 'Drafts'],
        ['▧', 'Trash'],
        ['📂', 'Spam'],
      ].forEach(([i, t], n) => {
        const x = u.el('div', n === 0 ? 'active' : '', rail);
        u.el('b', '', x, i);
        u.el('span', '', x, t);
      });
      u.el('div', 'ds-folder-label', rail, 'Folders');
      ['Family', 'Work', 'Travel', 'Receipts', 'Archive'].forEach((t) => {
        const x = u.el('div', 'ds-folder', rail);
        u.el('b', '', x, '📁');
        u.el('span', '', x, t);
      });
      const content = u.el('div', 'ds-content', body);
      let mode = ctx.display || 'header';
      if (mode === 'panel' && document.documentElement.clientWidth < 1260) mode = 'header';
      if (mode === 'toast' && document.documentElement.clientHeight < 700) mode = 'header';
      const main = u.el('div', 'ds-main', content);
      const stage = u.el('main', 'ds-stage', main);
      const side = u.el('aside', 'ds-side', body);
      const calendar = u.el('section', 'ds-calendar', side);
      u.el('header', '', calendar, '‹　　 April 2010　　 ›');
      u.el('div', 'ds-week', calendar, 'Sun　 Mon　 Tue　 Wed　 Thu　 Fri　 Sat');
      const days = u.el('div', 'ds-days', calendar);
      [
        '',
        '',
        '',
        '',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '14',
        '9',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
        '19',
        '20',
        '21',
        '22',
        '23',
        '24',
        '25',
        '26',
        '27',
        '28',
        '29',
        '30',
        '',
      ].forEach((d, i) => {
        const z = u.el('span', d === '14' && i === 11 ? 'selected' : '', days, d);
      });
      const tips = u.el('section', 'ds-tips', side);
      u.el('h2', '', tips, '💡　Quick Tips　📌');
      [
        'Click a message to read it in the preview pane.',
        'Use the toolbar to reply, forward or delete.',
        'Organize with folders and labels.',
      ].forEach((t) => u.el('p', '', tips, '•　' + t));
      if (mode === 'panel') {
        const note = u.el('aside', 'ds-instruction ds-panel-note', side, ctx.instruction);
        note.title = 'Task note';
      } else if (mode === 'toast') {
        u.el('aside', 'ds-instruction ds-instruction-toast', content, ctx.instruction);
      } else if (mode === 'header') {
        u.el('aside', 'ds-instruction ds-header-note', top, ctx.instruction);
      }
      const foot = u.el('footer', 'ds-footer', content);
      if (!ctx.finish && placement === 'footer') submit = makeSubmit(foot, 'ds-submit');
      if (!ctx.finish && placement === 'status') submit = makeSubmit(top, 'ds-submit ds-submit-status');
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
