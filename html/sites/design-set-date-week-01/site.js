(function () {
  'use strict';
  const C = { site: 'design-set-date-week-01' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const body = u.el('div', 'ds-body', document.body);
      const top = u.el('header', 'ds-top', body);
      u.el('span', 'ds-app-icon', top, '▥');
      u.el('span', 'ds-brand', top, 'Weekly Reports');
      const controls = u.el('div', 'ds-window-controls', top);
      for (const [t, c] of [
        ['−', 'min'],
        ['□', 'max'],
        ['×', 'close'],
      ]) {
        const b = u.el('button', 'ds-win ' + c, controls, t);
        b.type = 'button';
        b.tabIndex = -1;
      }
      const content = u.el('div', 'ds-content', body);
      if (ctx.display !== 'hidden') {
        const cls = ctx.display === 'panel' ? 'ds-panel-note' : ctx.display === 'toast' ? 'ds-toast' : 'ds-header-note';
        const note = u.el('aside', cls, content);
        u.el('div', 'ds-instruction', note, ctx.instruction);
      }
      const stage = u.el('main', 'ds-stage', content);
      const records = u.el('section', 'ds-records', content);
      const table = u.el('div', 'ds-record-head', records);
      u.el('span', 'ds-record-icon', table, '');
      u.el('span', '', table, 'Week');
      u.el('span', '', table, 'Title');
      const rows = [
        ['Jan 1, 2029', 'Product Development'],
        ['Jan 8, 2029', 'Product Development'],
        ['Jan 15, 2029', 'Product Development'],
        ['Jan 22, 2029', 'Marketing'],
        ['Jan 29, 2029', 'Marketing'],
      ];
      for (const [date, title] of rows) {
        const row = u.el('div', 'ds-record-row', records);
        u.el('span', 'ds-file-icon', row, '▤');
        u.el('span', '', row, date);
        u.el('span', '', row, title);
      }
      const foot = u.el('footer', 'ds-footer', content);
      const er = ctx.rng.fork('chrome/end');
      const bank =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      let label = 'Confirm',
        placement = 'footer';
      if (!ctx.finish) {
        const alternatives = bank.map(labelOf).filter((x) => x.trim().toLowerCase() !== 'submit');
        if (er.bool(0.5)) {
          label = 'Confirm';
        } else if (alternatives.length) label = er.pick(alternatives);
        placement = er.pick(['footer', 'footer', 'header', 'link']);
      }
      let submit = null;
      const endButton = (parent, cls, text, link) => {
        const b = u.el(link ? 'a' : 'button', cls, parent, text);
        if (link) b.href = '#';
        else b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      if (placement === 'header') {
        const b = endButton(top, 'ds-end-header', label, false);
        b.classList.add('ds-toolbar-end');
        submit = b;
      }
      if (placement === 'footer') submit = endButton(foot, 'ds-submit', label, false);
      if (placement === 'link') submit = endButton(foot, 'ds-end-link', label + ' ›', true);
      if (!ctx.finish) {
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const words = bank.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (words.length) {
            const text = cr.pick(words),
              d = u.el('button', 'ds-xtra', foot, text);
            d.type = 'button';
            d.dataset.role = 'xtra';
            d.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
          }
        }
      }
      const language = u.el('button', 'ds-cancel', foot, 'Language');
      language.type = 'button';
      language.dataset.role = 'xtra';
      language.addEventListener('click', () => env.log('decoy', { label: 'Language', collide: false }));
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
