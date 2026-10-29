(function () {
  'use strict';
  const C = {
    site: 'design-set-date-time-11',
    menu: ['Desk', 'File', 'Options', 'Help'],
    clock: 'Mon Apr 14, 1987',
    time: '10:03 AM',
    winTitle: 'Room Reservation',
  };
  const LOGO =
    '<svg viewBox="0 0 26 20" width="100%" height="100%"><rect x="5" y="1" width="20" height="15" rx="1" fill="#fff" stroke="#000" stroke-width="2"/><rect x="1" y="5" width="21" height="14" rx="1" fill="#fff" stroke="#000" stroke-width="2"/><rect x="4" y="7" width="15" height="9" fill="#000"/></svg>';
  const CLOSE =
    '<svg viewBox="0 0 40 40" width="100%" height="100%"><path d="M8 13H32M8 27H32" stroke="#000" stroke-width="4"/></svg>';
  const X =
    '<svg viewBox="0 0 40 40" width="100%" height="100%"><path d="M9 9L31 31M31 9L9 31" stroke="#000" stroke-width="4"/></svg>';
  const PIN =
    '<svg viewBox="0 0 40 40" width="100%" height="100%"><path d="M8 28H32L26 18H14ZM20 8L20 18" stroke="#000" stroke-width="3.5" fill="#000"/></svg>';
  const WARN =
    '<svg viewBox="0 0 80 76" width="100%" height="100%"><path d="M40 5L76 70H4Z" fill="#fff" stroke="#000" stroke-width="5" stroke-linejoin="round"/><path d="M40 26V47" stroke="#000" stroke-width="7"/><circle cx="40" cy="58" r="4.5" fill="#000"/></svg>';
  const ICONS = [
    '<svg viewBox="0 0 36 36"><path d="M8 3H22L29 10V33H8Z" fill="#fff" stroke="#000" stroke-width="2.5"/><path d="M22 3V10H29M12 15H25M12 20H25M12 25H25" stroke="#000" stroke-width="2"/></svg>',
    '<svg viewBox="0 0 36 36"><path d="M3 9H14L17 12H33V30H3Z" fill="#fff" stroke="#000" stroke-width="2.5"/></svg>',
    '<svg viewBox="0 0 36 36"><path d="M10 5H26V12H10ZM5 12H31V26H5ZM10 20H26V32H10Z" fill="#fff" stroke="#000" stroke-width="2.5"/></svg>',
    '<svg viewBox="0 0 36 36"><rect x="4" y="5" width="28" height="26" fill="#fff" stroke="#000" stroke-width="2.5"/><path d="M4 12H32M11 12V31M18 12V31M25 12V31M4 18H32M4 24H32" stroke="#000" stroke-width="2"/></svg>',
    '<svg viewBox="0 0 36 36"><text x="18" y="29" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="32">?</text></svg>',
  ];
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    initialOverlay: { kind: 'promo' },
    frame(ctx) {
      const u = ctx.util;
      const root = u.el('div', 'gem', document.body);
      const bar = u.el('header', 'gem-menu', root);
      const lg = u.el('span', 'gem-logo', bar);
      lg.innerHTML = LOGO;
      C.menu.forEach((m) => u.el('span', 'gem-mi', bar, m));
      const clk = u.el('span', 'gem-clock', bar);
      u.el('span', '', clk, C.clock);
      u.el('span', 'gem-time', clk, C.time);
      if (ctx.display !== 'hidden') {
        const n = u.el('aside', 'gem-note gem-note-' + ctx.display, root);
        u.el('div', 'gem-instruction ds-instruction', n, ctx.instruction);
      }
      const win = u.el('div', 'gem-win', root);
      const tb = u.el('div', 'gem-title', win);
      const cb = u.el('span', 'gem-close', tb);
      cb.innerHTML = CLOSE;
      u.el('span', 'gem-wtitle', tb, C.winTitle);
      const panel = u.el('div', 'gem-panel', win);
      const stage = u.el('main', 'gem-stage', panel);
      u.el('div', 'gem-rule', panel);
      const foot = u.el('footer', 'gem-foot', panel);
      let submit = null;
      const endRng = ctx.rng.fork('chrome/end');
      const labels = ctx.content.END_LABELS.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name));
      const placement = endRng.pick(endRng.bool(0.5) ? ['footer', 'title'] : ['footer', 'link']);
      const classic = placement === 'footer';
      const label = classic ? 'Submit' : endRng.pick(labels);
      if (!ctx.finish) {
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          placement === 'footer' ? 'gem-submit' : 'gem-end gem-end-' + placement,
          placement === 'title' ? tb : foot,
          label,
        );
        if (submit.tagName === 'BUTTON') submit.type = 'button';
        else submit.href = '#';
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      const clear = u.el('button', 'gem-clear', foot, 'Clear');
      clear.type = 'button';
      clear.addEventListener('click', () => env.log('decoy', { label: 'Clear' }));
      const collideRng = ctx.rng.fork('chrome/collide');
      if (collideRng.bool(0.3)) {
        const options = labels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) {
          const text = collideRng.pick(options);
          const decoy = u.el('button', 'gem-xtra', foot, text);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        }
      }
      const tools = u.el('aside', 'gem-tools', win);
      ICONS.forEach((s, i) => {
        if (i === 3 || i === 4) u.el('div', 'gem-trule', tools);
        const d = u.el('div', 'gem-ticon', tools);
        d.innerHTML = s;
      });
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'gem-dlg ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const tb = u.el('div', 'gem-dtitle', el);
      const pin = u.el('span', 'gem-dpin', tb);
      pin.innerHTML = PIN;
      u.el('span', 'gem-dname', tb, 'System Update Available');
      const x = u.el('button', 'gem-dx', tb);
      x.type = 'button';
      x.innerHTML = X;
      x.addEventListener('click', () => ctx.dismiss('close'));
      const body = u.el('div', 'gem-dbody', el);
      const ic = u.el('span', 'gem-dwarn', body);
      ic.innerHTML = WARN;
      const tx = u.el('div', 'gem-dtext', body);
      u.el('div', '', tx, 'A new version of GEM is available.');
      u.el('div', '', tx, 'Would you like to install it now?');
      const btns = u.el('div', 'gem-dbtns', el);
      const a = u.el('button', 'gem-dbtn', btns);
      a.type = 'button';
      u.el('span', '', a, 'Install Now');
      const dismiss = u.el('button', 'gem-dbtn gem-dbtn-def', btns);
      dismiss.type = 'button';
      u.el('span', '', dismiss, 'Remind me later');
      const d = u.el('button', 'gem-dbtn', btns);
      d.type = 'button';
      u.el('span', '', d, 'Details...');
      [a, dismiss, d].forEach((b) => b.addEventListener('click', () => ctx.dismiss('close')));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
