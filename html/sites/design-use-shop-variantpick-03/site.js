(function () {
  'use strict';
  const D = { site: 'design-use-shop-variantpick-03' };
  env.site({
    name: D.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      document.documentElement.style.setProperty('--bg', '#b8b8b8');
      document.documentElement.style.setProperty('--panel', '#c5c5c5');
      document.documentElement.style.setProperty('--fg', '#111');
      document.documentElement.style.setProperty('--accent', '#f39200');
      document.documentElement.style.setProperty('--line', '#777');
      document.documentElement.style.setProperty('--muted', '#444');
      document.documentElement.style.setProperty('--font', 'monospace');
      document.body.className = 'amiga instruction-' + ctx.display;
      const shell = u.el('div', 'site-shell', document.body);
      const menu = u.el('header', 'workbench-menu', shell);
      u.el('span', 'amiga-mark', menu, '◢');
      u.el('b', 'workbench-name', menu, 'Amiga Workbench');
      u.el('span', 'menu-words', menu, 'File　 Edit　 View　 Shop　 Help');
      u.el('span', 'workbench-clock', menu, 'Mon 14 Apr 1997　10:24');
      u.el('span', 'screen-gadget', menu, '▣');
      const title = u.el('div', 'window-title', shell);
      u.el('span', 'window-icon', title, '▣');
      u.el('b', 'window-name', title, 'Shop');
      const actions = u.el('div', 'window-actions', title);
      let submit = null;
      if (!ctx.finish) {
        const endRng = ctx.rng.fork('chrome/end'),
          collisionRng = ctx.rng.fork('chrome/collide');
        const bank = ctx.content && ctx.content.END_LABELS;
        const labels =
          Array.isArray(bank) && bank.length
            ? bank
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
        const str = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        const label = endRng.bool(0.5) ? 'OK' : str(endRng.pick(labels));
        submit = u.el('button', 'end-control', actions, label);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.addEventListener('click', () => ctx.submit());
        if (collisionRng.bool(0.3)) {
          const choices = labels.map(str).filter((x) => x.toLowerCase() !== label.toLowerCase());
          if (choices.length) {
            const dec = u.el('button', 'menu-xtra', actions, collisionRng.pick(choices));
            dec.type = 'button';
            dec.dataset.role = 'xtra';
            dec.addEventListener('click', () => env.log('decoy', { label: dec.textContent, collide: true }));
          }
        }
      }
      for (const sym of ['−', '□', '×']) u.el('span', 'window-gadget', title, sym);
      const row = u.el('div', 'workbench-row', shell);
      const rail = u.el('nav', 'workbench-rail', row);
      [
        ['⌂', 'Home'],
        ['⌕', 'Search'],
        ['▣', 'Clothing'],
        ['◢', 'Shoes'],
        ['▣', 'Bag'],
        ['▤', 'Orders'],
      ].forEach(([i, n], k) => {
        const e = u.el('div', 'rail-item' + (k === 2 ? ' selected' : ''), rail);
        u.el('span', 'rail-icon', e, i);
        u.el('span', '', e, n);
      });
      const main = u.el('main', 'workbench-main', row);
      const note = u.el('section', 'task-note', main);
      note.dataset.role = 'instruction';
      u.el('h2', '', note, 'Order request');
      if (ctx.display !== 'hidden') u.el('p', 'food-task', note, ctx.instruction);
      const stage = u.el('div', 'stage', main);
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const copy = {
        cookie: ['Cookie notice', 'Optional cookies are used for this shop.', 'Dismiss'],
        toast: ['Notice', 'The shop is ready.', 'Dismiss'],
        chat: ['Help', 'Need help with your order?', 'Close'],
        promo: ['Shop bulletin', 'See the latest offers.', 'Close'],
        banner: ['Announcement', 'Shop information for today.', 'Dismiss'],
      };
      const [h, t, b] = copy[ctx.kind];
      const el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      u.el('h2', '', el, h);
      u.el('div', 'overlay-copy', el, t);
      const actions = u.el('div', 'overlay-actions', el);
      const d = u.el('button', 'primary', actions, b);
      d.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss: d };
    },
  });
})();
