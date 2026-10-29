(function () {
  'use strict';
  const C = { site: 'design-set-date-duration-04' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const main = u.el('div', 'ds-main', content);
      const stage = u.el('main', 'ds-stage', main);
      const rail = u.el('aside', 'ds-rail', main);
      u.el('h2', '', rail, 'Workout Details');
      const rows = [
        ['▤', 'Strength Training', 'Workout title'],
        ['▰', 'Strength', 'Workout type'],
        ['◷', '0h 30m', 'Duration'],
        ['▢', 'Apr 24, 2025', 'Date'],
        ['▧', 'No notes yet', 'Notes'],
      ];
      rows.forEach((r, i) => {
        const e = u.el('div', 'ds-detail', rail);
        u.el('span', 'ds-detail-icon', e, r[0]);
        const t = u.el('div', '', e);
        u.el('div', 'ds-detail-value', t, r[1]);
        u.el('div', 'ds-detail-label', t, r[2]);
      });
      const settings = u.el('section', 'ds-settings', rail);
      u.el('h2', '', settings, 'Activity Settings');
      [
        ['◎', 'Intensity', 'Moderate'],
        ['▥', 'Difficulty', 'Intermediate'],
        ['◇', 'Tags', 'None'],
      ].forEach((r) => {
        const e = u.el('div', 'ds-setting', settings);
        u.el('span', 'ds-detail-icon', e, r[0]);
        u.el('span', '', e, r[1]);
        u.el('span', 'ds-setting-value', e, r[2] + '⌄');
      });
      const reminders = u.el('section', 'ds-reminders', rail);
      u.el('h2', '', reminders, 'Reminders');
      const reminder = u.el('div', 'ds-reminder', reminders);
      u.el('span', 'ds-detail-icon', reminder, '♧');
      u.el('span', '', reminder, 'Add a reminder');
      u.el('span', 'ds-toggle', reminder, '');
      let note = null;
      if (ctx.display !== 'hidden') {
        if (ctx.display === 'panel') {
          note = u.el('aside', 'ds-brief', rail);
          u.el('div', 'ds-instruction', note, ctx.instruction);
        } else {
          note = u.el('aside', ctx.display === 'toast' ? 'ds-toast' : 'ds-header-note', content);
          u.el('div', 'ds-instruction', note, ctx.instruction);
          content.insertBefore(note, main);
        }
      }
      const foot = u.el('footer', 'ds-footer', body);
      const endRng = ctx.rng.fork('chrome/end');
      const bank =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      let placement = null,
        label = 'Submit';
      if (!ctx.finish) {
        if (endRng.bool(0.5)) {
          placement = 'footer';
        } else {
          const alternatives = bank.map(labelOf).filter((x) => x.trim().toLowerCase() !== 'submit');
          if (alternatives.length) label = endRng.pick(alternatives);
          placement = endRng.pick(['footer', 'footer', 'header', 'link']);
        }
      }
      let submit = null;
      const endButton = (parent, cls, text, asLink) => {
        const b = u.el(asLink ? 'a' : 'button', cls, parent, text);
        if (asLink) b.href = '#';
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
        const top = u.el('header', 'ds-top', content);
        submit = endButton(top, 'ds-end-header', label, false);
      }
      if (placement === 'footer') submit = endButton(foot, 'ds-submit', label, false);
      if (placement === 'link') submit = endButton(foot, 'ds-end-link', label + ' ›', true);
      if (!ctx.finish) {
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const words = bank.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (words.length) {
            const text = cr.pick(words);
            const d = u.el('button', 'ds-xtra', foot, text);
            d.type = 'button';
            d.dataset.role = 'xtra';
            d.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
          }
        }
      }
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
