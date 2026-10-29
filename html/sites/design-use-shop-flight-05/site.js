(function () {
  'use strict';
  const D = {
    'site': 'design-use-shop-flight-05',
    'tokens': {
      'bg': '#0e151b',
      'panel': '#141d24',
      'fg': '#edf2f8',
      'accent': '#59fa72',
      'font': "Roboto,'Segoe UI','Helvetica Neue',Arial,sans-serif",
      'line': '#2c3c49',
      'muted': '#b4c8dc',
    },
    'obstruction': null,
  };
  const PLANE =
    '<svg viewBox="0 0 34 32" width="34" height="34" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12l5 3h6L10 3h3l7 12h10c3 0 3 3 0 3H20l-7 12h-3l4-12H8l-5 3H1l3-5-3-4z"/><g class="plane-trail" fill="currentColor" stroke="none"><circle cx="31" cy="7" r="2.1"/><circle cx="27" cy="7.8" r="1.2"/></g></svg>';
  const CAL =
    '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><rect x="3" y="4" width="18" height="17" rx="1"/><path d="M3 9h18M8 2v4M16 2v4"/><path fill="currentColor" stroke="none" d="M6 14l4-1-1-2h1l2 2 5-1v2l-5 1-2 3H9l1-3-4 1z"/></svg>';
  const GEAR =
    '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M12 2l2 3 3-1 1 3 3 1-1 3 2 2-2 2 1 3-3 1-1 3-3-1-2 3-2-3-3 1-1-3-3-1 1-3-2-2 2-2-1-3 3-1 1-3 3 1z"/></svg>';
  env.site({
    name: D.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      for (const [k, v] of Object.entries(D.tokens)) document.documentElement.style.setProperty('--' + k, v);
      document.body.className = 'instruction-' + ctx.display;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      const logo = u.el('div', 'sf-logo', header);
      logo.innerHTML = PLANE;
      u.el('div', 'design-brand', header, 'SkyFind');
      const nav = u.el('nav', 'design-nav', header);
      ['Flights', 'Hotels', 'Cars', 'More'].forEach((t, i) => u.el('span', i ? '' : 'on', nav, t));
      const hr = u.el('div', 'sf-hr', header);
      const g = u.el('span', 'sf-gear', hr);
      g.innerHTML = GEAR;
      u.el('span', 'sf-ava', hr, 'JD');
      const body = u.el('div', 'design-body', shell);
      const left = u.el('div', 'sf-left', body);
      const note = u.el('section', 'task-note', left);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') u.el('p', 'food-task', note, ctx.instruction);
      const stage = u.el('main', 'stage', left);
      const side = u.el('aside', 'sf-side', body);
      const sh = u.el('div', 'sf-sh', side);
      const ic = u.el('span', 'sf-sic', sh);
      ic.innerHTML = CAL;
      u.el('span', 'sf-st', sh, 'Trip Summary');
      const close = u.el('span', 'sf-x', sh);
      close.innerHTML =
        '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M3 3l14 14M17 3L3 17"/></svg>';
      const itinerary = u.el('div', 'sf-itinerary', side);
      const routeRow = u.el('div', 'sf-route-row', itinerary);
      u.el('span', 'sf-route', routeRow, 'From → To');
      const edit = u.el('button', 'sf-edit', routeRow, 'Edit');
      edit.type = 'button';
      u.el('div', 'sf-tripdate', itinerary, 'One-way  •  1 traveler');
      const mid = u.el('div', 'sf-mid', side);
      const empty = u.el('div', 'sf-empty', mid);
      const ei = u.el('div', 'sf-ei', empty);
      ei.innerHTML = PLANE;
      u.el('div', 'sf-e1', empty, 'No flight selected');
      u.el('div', 'sf-e2', empty, 'Choose a flight and click Book to continue.');
      const dash = u.el('svg', 'sf-dash', mid);
      dash.outerHTML =
        '<svg class="sf-dash" width="100%" height="100%" aria-hidden="true"><rect x="0.5" y="0.5" width="calc(100% - 1px)" height="calc(100% - 1px)" rx="7" fill="none" stroke="#536a7d" stroke-width="1" stroke-dasharray="7 7"/></svg>';
      const sums = u.el('div', 'sf-sums', side);
      for (const [l, v, c] of [
        ['Fare', '$0.00', 'fare'],
        ['Taxes & fees', '$0.00', 'tax'],
        ['Total', '$0.00', 'tot'],
      ]) {
        const r = u.el('div', 'sf-sum ' + c, sums);
        u.el('span', '', r, l);
        u.el('span', 'sf-value', r, v);
      }
      let submit = null;
      const labels = (
        ctx.content && Array.isArray(ctx.content.END_LABELS)
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
      ).map((x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x)));
      const endRng = ctx.rng.fork('chrome/end');
      const placement = ctx.finish ? null : endRng.bool(0.5) ? 'summary' : endRng.pick(['header', 'itinerary']);
      const preferredLabel = labels.find((x) => x.trim().toLowerCase() === 'submit') || 'Submit';
      const alternatives = labels.filter((x) => x.trim().toLowerCase() !== preferredLabel.trim().toLowerCase());
      const submitLabel = endRng.bool(0.5)
        ? preferredLabel
        : alternatives.length
          ? endRng.pick(alternatives)
          : preferredLabel;
      const makeEnd = (parent, cls, label) => {
        const b = u.el('button', cls, parent, label);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      if (!ctx.finish) {
        if (placement === 'summary') submit = makeEnd(side, 'end-control', submitLabel);
        else if (placement === 'header') submit = makeEnd(hr, 'end-control end-header', submitLabel);
        else submit = makeEnd(itinerary, 'end-control end-inline', submitLabel);
      }
      const collideRng = ctx.rng.fork('chrome/collide');
      if (collideRng.bool(0.3)) {
        const choices = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== submitLabel.trim().toLowerCase());
        if (choices.length) {
          const label = collideRng.pick(choices),
            decoy = u.el('button', 'sf-xtra', hr, label);
          decoy.type = 'button';
          decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const texts = {
        cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
        toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
        chat: ['Help', 'Need help with this workspace?', 'Close'],
        promo: ['News and updates', 'Discover the latest workspace updates.', 'Close'],
        banner: ['Announcement', 'You can still work now. Save your changes regularly.', 'Collapse announcement'],
      };
      const [title, copy, label] = texts[ctx.kind];
      const el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-label', title);
      u.el('h2', '', el, title);
      u.el('div', 'overlay-copy', el, copy);
      const actions = u.el('div', 'overlay-actions', el);
      if (ctx.kind === 'cookie') {
        const accept = u.el('button', '', actions, 'Accept all');
        accept.addEventListener('click', () => ctx.dismiss());
      }
      const dismiss = u.el('button', 'primary', actions, label);
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    },
  });
})();
