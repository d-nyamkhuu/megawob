(function () {
  'use strict';
  const C = {
    'site': 'design-set-date-typed-02',
    'title': 'Schedule Appointment',
    'menu': 'File|Edit|View|Special|Help',
  };
  const ICON =
    '<svg viewBox="0 0 40 52" width="100%" height="100%"><path d="M3 6h27l10 9v35H3z" fill="#fff" stroke="#000" stroke-width="2.5"/><path d="M30 6v9h10M9 2v7M16 2v7M23 2v7" fill="none" stroke="#000" stroke-width="2.5"/><path d="M9 18h3m3 0h18M9 24h3m3 0h18M9 30h3m3 0h18M9 36h3m3 0h18M9 42h24" stroke="#000" stroke-width="2.2"/></svg>';
  const APPLE =
    '<svg viewBox="0 0 24 28" width="18" height="21"><path d="M17.5 14.7c0-3 2.5-4.4 2.6-4.5-1.4-2.1-3.6-2.3-4.4-2.4-1.9-.2-3.6 1.1-4.600 1.100-1 0-2.400-1.100-4-1C5 7.900 3.200 9.100 2.200 10.900c-2.100 3.700-.5 9.100 1.500 12.100 1 1.400 2.200 3.100 3.700 3 1.500-.1 2.100-1 3.900-1s2.300 1 3.900.9c1.600 0 2.600-1.500 3.600-2.900 1.100-1.700 1.600-3.300 1.600-3.400-.1 0-3.100-1.200-3.100-4.800zM14.500 5.800c.8-1 1.400-2.400 1.200-3.800-1.200.1-2.700.8-3.500 1.800-.8.900-1.400 2.300-1.300 3.700 1.300.1 2.700-.7 3.600-1.700z"/></svg>';
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const nav = u.el('nav', 'ds-menu', document.body);
      const ap = u.el('span', 'ds-apple', nav);
      ap.innerHTML = APPLE;
      C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      const win = u.el('div', 'ds-win', document.body);
      const top = u.el('header', 'ds-top', win);
      u.el('span', 'ds-box', top);
      u.el('span', 'ds-title', top, C.title);
      u.el('span', 'ds-box', top);
      const head = u.el('div', 'ds-head', win);
      const ic = u.el('span', 'ds-icon', head);
      ic.innerHTML = ICON;
      const ht = u.el('div', 'ds-headtext', head);
      u.el('div', 'ds-h1', ht, 'Patient Appointment');
      u.el('div', 'ds-h2', ht, 'Riverside Medical Clinic');
      u.el('div', 'ds-headdate', head, 'Mon Sep 14, 1987');
      const content = u.el('div', 'ds-content', win);
      const mode = ['header', 'panel', 'toast', 'hidden'].includes(ctx.display) ? ctx.display : 'header';
      if (mode === 'header') {
        const b = u.el('aside', 'ds-header-note', content);
        u.el('div', 'ds-instruction', b, ctx.instruction);
      }
      if (mode === 'panel' || mode === 'toast') {
        const b = u.el('aside', mode === 'panel' ? 'ds-episode-panel' : 'ds-toast', content);
        if (mode === 'panel') u.el('div', 'ds-panel-title', b, 'Task note');
        u.el('div', 'ds-instruction', b, ctx.instruction);
      }
      const main = u.el('div', 'ds-main', content);
      const stage = u.el('main', 'ds-stage', main);
      const foot = u.el('footer', 'ds-footer', content);
      const clear = u.el('button', 'ds-btn ds-clear', foot, 'Clear Form');
      clear.type = 'button';
      u.el('span', 'ds-fill', foot);
      const cancel = u.el('button', 'ds-btn', foot, 'Cancel');
      cancel.type = 'button';
      let submit = null;
      const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        const labels =
          ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
            ? ctx.content.END_LABELS
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
        const keepDefault = er.bool(0.5);
        const alternateLabels = labels.filter((x) => labelOf(x).trim().toLowerCase() !== 'submit');
        const label = keepDefault ? 'Submit' : labelOf(er.pick(alternateLabels.length ? alternateLabels : labels));
        const placement = keepDefault ? 'footer' : er.pick(['footer', 'header', 'link']);
        let headActions = null;
        const makeSubmit = (parent, cls, text) => {
          const b = u.el(placement === 'link' && cls === 'ds-endlink' ? 'a' : 'button', cls, parent, text);
          b.type = 'button';
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
          headActions = u.el('div', 'ds-head-actions', top);
          submit = makeSubmit(headActions, 'ds-btn ds-submit ds-head-submit', label);
        }
        if (placement === 'link') submit = makeSubmit(foot, 'ds-endlink', label + ' ›');
        if (placement === 'footer') submit = makeSubmit(foot, 'ds-btn ds-submit', label);
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const pool = labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (pool.length) {
            const collision = cr.pick(pool);
            const parent = placement === 'header' ? headActions : foot;
            const decoy = u.el('button', 'ds-xtra', parent, collision);
            decoy.type = 'button';
            decoy.dataset.role = 'xtra';
            decoy.addEventListener('click', () => env.log('decoy', { label: collision, collide: true }));
            if (placement !== 'header' && submit) foot.insertBefore(decoy, submit);
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
