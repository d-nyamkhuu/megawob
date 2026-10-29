(function () {
  'use strict';
  const C = {
    site: 'design-set-date-time-02',
    tab: 'Restaurant Reservation',
    brand: 'Lakeside Grill',
    sub: 'Make a Reservation',
    rail: 'Confirm Reservation',
    railText: 'Please set the correct time.',
    menus: ['File', 'Edit', 'Window', 'Help'],
    date: 'Tue Apr 27',
    clock: '3:14 PM',
  };
  const ICON =
    '<svg viewBox="0 0 60 60" width="100%" height="100%"><defs><linearGradient id="cutlery"><stop stop-color="#777"/><stop offset=".45" stop-color="#171717"/><stop offset="1" stop-color="#444"/></linearGradient></defs><g fill="#999" transform="translate(1.5 1.5)"><path d="M13 3h2v14h2V3h2v14h2V3h2v14h2V3h2v20l-5 5v27q-3 3-6 0V28l-5-5zM42 3q-10 7-10 25l5 2v25q3 3 6 0V3z"/></g><g fill="url(#cutlery)" stroke="#555" stroke-width=".5"><path d="M13 3h2v14h2V3h2v14h2V3h2v14h2V3h2v20l-5 5v27q-3 3-6 0V28l-5-5zM42 3q-10 7-10 25l5 2v25q3 3 6 0V3z"/></g></svg>';
  const WORKSPACE =
    '<svg viewBox="0 0 28 32" stroke="#33434c" stroke-width="1.2"><path d="M3 10L15 2l10 5-3 16-12 5-7-5z" fill="#70c4f6"/><path d="M5 11l10-6 7 3-2 10-10 5-5-3z" fill="#d3eeff"/><path d="M10 23v6h12l-2-8" fill="#aaa"/><path d="M13 23L24 6l3 2-11 18-4 2z" fill="#f5a53a"/><path d="M12 28l4-2-3-3z" fill="#333"/></svg>';
  const APPICON =
    '<svg viewBox="0 0 28 32" stroke="#444" stroke-width="1.2"><path d="M6 9l5-6 12 5-4 12-10 2-3-6z" fill="#aaa"/><path d="M8 9l5-3 7 4-3 7-7 2z" fill="#ddd"/><path d="M11 18v10l6-1 2-10" fill="#999"/><path d="M5 9l4 1-2 9 4 4-2 2-5-6z" fill="#eee"/><path d="M18 9l3 1-5 14-3-1z" fill="#e5ae29"/></svg>';
  const SPK =
    '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="#222" stroke-width="2"><path d="M3 9h4l5-4v14l-5-4H3z" fill="#222"/><path d="M15 8q3 4 0 8M18 6q5 6 0 12"/></svg>';
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const endRng = ctx.rng.fork('chrome/end');
      const endLabels =
        ctx.content && Array.isArray(ctx.content.END_LABELS)
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
      const keepDefault = !ctx.finish && endRng.bool(0.5);
      const placement = ctx.finish ? null : keepDefault ? 'rail' : endRng.pick(['menu', 'taskbar']);
      const label = keepDefault ? 'Submit' : labelOf(endRng.pick(endLabels));
      const collideRng = ctx.rng.fork('chrome/collide');
      const alternatives = [
        ...new Set(endLabels.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase())),
      ];
      const collide =
        !ctx.finish && alternatives.length > 0 && collideRng.bool(0.3)
          ? { label: collideRng.pick(alternatives), where: collideRng.pick(['menu', 'taskbar']) }
          : null;
      const makeEnd = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      const makeDecoy = (parent, text) => {
        const b = u.el('button', 'be-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        return b;
      };
      const desk = u.el('div', 'be-desk', document.body);
      const tab = u.el('div', 'be-tab', desk);
      u.el('span', '', tab, C.tab);
      const logo = u.el('div', 'be-top', desk);
      const bl = u.el('span', 'be-logo', logo);
      u.el('i', '', bl, 'Be');
      u.el('b', '', bl, 'OS');
      u.el('span', 'be-date', logo, C.date + '   ' + C.clock);
      const win = u.el('div', 'be-win', desk);
      const menu = u.el('nav', 'be-menu', win);
      for (const m of C.menus) u.el('span', '', menu, m);
      if (collide && collide.where === 'menu') makeDecoy(menu, collide.label);
      let submit = null;
      if (placement === 'menu') submit = makeEnd(menu, 'be-end-menu', label);
      const wb = u.el('span', 'be-wb', menu);
      u.el('i', 'be-min', wb);
      u.el('i', 'be-max', wb);
      const body = u.el('div', 'ds-body', win);
      const content = u.el('div', 'ds-content', body);
      const head = u.el('header', 'ds-top', content);
      const ic = u.el('div', 'be-icon', head);
      ic.innerHTML = ICON;
      const ht = u.el('div', 'be-ht', head);
      u.el('div', 'be-brand', ht, C.brand);
      u.el('div', 'be-sub', ht, C.sub);
      if (ctx.display !== 'hidden' && ctx.display !== 'panel') {
        const n = u.el('aside', 'ds-header-note' + (ctx.display === 'toast' ? ' ds-toast' : ''), content);
        u.el('div', 'ds-instruction', n, ctx.instruction);
      }
      const main = u.el('div', 'ds-main', content);
      if (ctx.display === 'panel') {
        const n = u.el('aside', 'ds-header-note ds-panel', main);
        u.el('div', 'ds-instruction', n, ctx.instruction);
      }
      const stage = u.el('main', 'ds-stage', main);
      const rail = u.el('aside', 'ds-rail', body);
      u.el('h2', '', rail, C.rail);
      u.el('p', '', rail, C.railText);
      u.el('div', 'ds-reservation-values', rail).hidden = true;
      u.el('div', 'be-grow', rail);
      if (!ctx.finish && placement === 'rail') submit = makeEnd(rail, 'ds-submit', label);
      const cancel = u.el('button', 'ds-cancel', rail, 'Cancel');
      cancel.type = 'button';
      const task = u.el('div', 'be-task', desk);
      const ws = u.el('span', 'be-ws', task);
      u.el('i', 'be-wsi', ws).innerHTML = WORKSPACE;
      u.el('span', '', ws, 'Workspace');
      const ap = u.el('span', 'be-app', task);
      u.el('i', 'be-wsi', ap).innerHTML = APPICON;
      u.el('span', '', ap, C.tab);
      if (collide && collide.where === 'taskbar') makeDecoy(task, collide.label);
      if (placement === 'taskbar') submit = makeEnd(task, 'be-end-taskbar', label);
      const sp = u.el('span', 'be-spk', task);
      sp.innerHTML = SPK;
      u.el('span', 'be-tc', task, C.clock);
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
