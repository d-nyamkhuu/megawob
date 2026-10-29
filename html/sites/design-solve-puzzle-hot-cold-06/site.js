(function () {
  'use strict';
  const C = {
    site: 'design-solve-puzzle-hot-cold-06',
    style: 'industrial',
    layout: 'industrial',
    title: 'Acme Supply Co.',
    menu: 'Site Map|Asset Search|Maintenance|Safety|Administration',
    subtitle: 'Partner Extranet',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = 'industrial instruction-' + ctx.display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        rail = u.el('aside', 'command-rail', app);
      for (const [i, label] of ['Home', 'Inventory', 'Orders', 'Facilities', 'Reports', 'Support'].entries()) {
        const row = u.el('div', 'rail-item' + (!i ? ' active' : ''), rail, label);
        if (label === 'Facilities') u.el('span', 'rail-arrow', row, '▶');
      }
      const shell = u.el('div', 'workspace', app),
        top = u.el('header', 'top', shell);
      u.el('strong', 'brand', top, C.title);
      u.el('span', 'partner', top, C.subtitle);
      const links = u.el('div', 'top-links', top);
      u.el('span', '', links, 'Help');
      u.el('i', '', links, '|');
      u.el('span', '', links, 'Contact');
      u.el('i', '', links, '|');
      u.el('span', '', links, 'Sign Out');
      u.el('span', 'date', top, 'Tue, Apr 13, 1999');
      const menu = u.el('nav', 'menu', shell);
      for (const [i, label] of C.menu.split('|').entries()) u.el('span', 'tab' + (!i ? ' selected' : ''), menu, label);
      const center = u.el('div', 'center', shell),
        brief = u.el('div', 'brief', center),
        stage = u.el('section', 'stage', center);
      if (ctx.display !== 'hidden') {
        if (ctx.display === 'panel') {
          u.el('strong', 'brief-title', brief, 'Task Instructions');
          u.el('span', 'brief-copy', brief, ctx.instruction);
        } else brief.textContent = ctx.instruction;
      } else {
        brief.textContent = 'Location search ready.';
        brief.classList.add('status-brief');
      }
      const recent = u.el('section', 'recent', shell),
        recentTitle = u.el('div', 'recent-title', recent, 'Recent Clicks'),
        table = u.el('div', 'recent-table', recent);
      for (const x of ['#', 'Time', 'Location', 'Hint', 'Distance']) u.el('span', 'th', table, x);
      u.el('span', 'td', table, '1');
      u.el('span', 'td', table, '10:24 AM');
      u.el('span', 'td', table, 'Conference 101');
      u.el('span', 'td cold-text', table, 'COLD');
      u.el('span', 'td', table, 'Farther away');
      const endRng = ctx.rng.fork('chrome/end'),
        content = ctx.content || {},
        fallback = ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'],
        bank = Array.isArray(content.END_LABELS) && content.END_LABELS.length ? content.END_LABELS : fallback,
        labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x)),
        submitLabel = bank.map(labelOf).find((x) => x.trim().toLowerCase() === 'submit') || 'Submit',
        label = endRng.bool(0.5) ? submitLabel : labelOf(endRng.pick((ctx.content && ctx.content.END_LABELS) || bank)),
        placement = endRng.pick(['footer', 'footer', 'toolbar', 'recent']);
      const collisionRng = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collisionRng.bool(0.3)) {
        const options = [...new Set(bank.map(labelOf))].filter(
          (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
        );
        if (options.length) collide = labelOf(collisionRng.pick(options));
      }
      const footer = u.el('footer', 'bottom', shell),
        endBtn = (parent, cls, text) => {
          const b = u.el('button', cls, parent, text);
          b.type = 'button';
          b.setAttribute('aria-label', text);
          b.title = text;
          b.addEventListener('click', ctx.submit);
          return b;
        },
        decoy = (parent, text) => {
          const b = u.el('button', 'industrial-xtra', parent, text);
          b.type = 'button';
          b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        };
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'footer') submit = endBtn(footer, 'submit', label);
        if (placement === 'toolbar') submit = endBtn(u.el('span', 'end-tools toolbar-tools', menu), 'submit', label);
        if (placement === 'recent')
          submit = endBtn(u.el('div', 'end-tools recent-tools', recentTitle), 'submit', label);
        if (collide) {
          const parent = placement === 'toolbar' ? menu : recentTitle;
          decoy(parent, collide);
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body),
        messages = {
          cookie: 'This application stores preferences on your device.',
          toast: 'Your workspace has been synced.',
          chat: 'Need help with this exercise?',
          promo: 'Try the new practice collection.',
          banner: 'An updated practice collection is available.',
        };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
