(function () {
  'use strict';
  const C = { 'site': 'design-set-date-calendar-07', 'brand': 'PROJECT PLANNER', 'nav': 'Plan / Track / Deliver' };
  const ICON =
    '<svg width="100%" height="100%" viewBox="0 0 38 42"><rect x="2" y="5" width="34" height="35" rx="2" fill="#111"/><path d="M10 2v8M28 2v8" stroke="#111" stroke-width="5" stroke-linecap="round"/><rect x="7" y="15" width="24" height="20" fill="#fff"/><path d="M11 19h3m4 0h3m4 0h3M11 25h3m4 0h3m4 0h3M11 31h3m4 0h3m4 0h3" stroke="#111" stroke-width="2"/></svg>';
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const endRng = ctx.rng.fork('chrome/end');
      const original = endRng.bool(0.5);
      const bank = ctx.content && ctx.content.END_LABELS;
      const labelText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const labels =
        bank && bank.length
          ? bank.map(labelText)
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const label = original ? 'Submit' : labelText(endRng.pick(labels));
      const placement = original ? 'footer' : endRng.pick(['footer', 'header', 'rail']);
      const collRng = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collRng.bool(0.3)) {
        const opts = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (opts.length) collide = collRng.pick(opts);
      }
      let display = ctx.display || 'header';
      if ((display === 'panel' || display === 'toast') && (window.innerWidth < 1260 || window.innerHeight < 700))
        display = 'header';
      const top = u.el('header', 'ds-top', document.body);
      const logo = u.el('span', 'ds-logo', top);
      logo.innerHTML = ICON;
      u.el('span', 'ds-brand', top, C.brand);
      u.el('nav', 'ds-menu', top, C.nav);
      let submit = null;
      const addSubmit = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', () => ctx.submit());
        submit = b;
        return b;
      };
      if (!ctx.finish && placement === 'header') addSubmit(top, 'ds-btn ds-header-submit', label);
      const body = u.el('div', 'ds-body', document.body);
      const left = u.el('div', 'ds-left', body);
      if (display === 'header') {
        const b = u.el('aside', 'ds-note-box', left);
        u.el('div', 'ds-instruction', b, ctx.instruction);
      }
      const stage = u.el('main', 'ds-stage', left);
      const rail = u.el('aside', 'ds-rail', body);
      const railHead = u.el('div', 'ds-rail-head', rail);
      u.el('h2', 'ds-rail-title', railHead, 'Project Details');
      if (!ctx.finish && placement === 'rail') addSubmit(railHead, 'ds-btn ds-rail-submit', label);
      const det = u.el('div', 'ds-details', rail);
      ['Name', 'Start date', 'End date', 'Owner', 'Priority'].forEach((k) => {
        const r = u.el('div', 'ds-drow', det);
        u.el('b', '', r, k + ':');
        u.el('span', '', r, '—');
      });
      if (display === 'panel') {
        const note = u.el('aside', 'ds-rail-note', rail);
        u.el('b', 'ds-rail-note-title', note, 'Project instruction');
        u.el('div', 'ds-rail-note-text', note, ctx.instruction);
      }
      u.el('hr', 'ds-hr', rail);
      u.el('h2', 'ds-help-title', rail, 'Calendar Help');
      u.el('hr', 'ds-hr2', rail);
      const ol = u.el('ol', 'ds-help', rail);
      [
        'Click the calendar icon next to the date field.',
        'Select the requested date in the calendar.',
        'The date will appear in MM/DD/YYYY format in the field.',
      ].forEach((t) => u.el('li', '', ol, t));
      if (display === 'toast') {
        const note = u.el('aside', 'ds-rail-toast', rail);
        u.el('span', 'ds-toast-mark', note, 'NOTICE');
        u.el('div', '', note, ctx.instruction);
      }
      const foot = u.el('footer', 'ds-footer', document.body);
      const c1 = u.el('button', 'ds-btn ds-grey', foot, 'Clear All');
      c1.type = 'button';
      const c2 = u.el('button', 'ds-btn', foot, 'Reset');
      c2.type = 'button';
      if (collide) {
        const d = u.el('button', 'ds-btn ds-pq', foot, collide);
        d.type = 'button';
        d.dataset.role = 'xtra';
        d.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      u.el('span', 'ds-spacer', foot);
      if (!ctx.finish && placement === 'footer') addSubmit(foot, 'ds-btn ds-submit', label);
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
