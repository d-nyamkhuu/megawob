(function () {
  'use strict';
  const C = {
    'site': 'design-set-date-calendar-10',
    'brand': 'Event Scheduler',
    'menu': ['File', 'Edit', 'View', 'Tools', 'Help'],
    'tools': ['New', 'Open', 'Save', 'Clear', 'Print'],
  };
  const ICONS = {
    New: '<svg viewBox="0 0 56 60" width="56" height="60"><defs><linearGradient id="paper" x2=".8" y2="1"><stop stop-color="#fff"/><stop offset=".55" stop-color="#edf6ff"/><stop offset="1" stop-color="#b9d5f5"/></linearGradient></defs><path d="M6 2h30l14 14v42H6z" fill="url(#paper)" stroke="#7295c0" stroke-width="2"/><path d="M36 2v14h14" fill="#e1edfa" stroke="#52799e" stroke-width="2"/><path d="M9 5v50h37" fill="none" stroke="#fff"/></svg>',
    Open: '<svg viewBox="0 0 60 56" width="60" height="56"><defs><linearGradient id="folder"><stop stop-color="#ffe789"/><stop offset="1" stop-color="#f9bf30"/></linearGradient></defs><path d="M3 12l3-6h15l5 6h27v35H3z" fill="#ffd04c" stroke="#c49b32" stroke-width="2"/><path d="M9 14h40v26H9z" fill="#fff8d5" stroke="#cda448"/><path d="M9 23h48l-9 27H2z" fill="url(#folder)" stroke="#ba8f2b" stroke-width="2"/><path d="M11 25h43M5 46l6-20" stroke="#fff4b4" stroke-width="2"/></svg>',
    Save: '<svg viewBox="0 0 56 56" width="56" height="56"><defs><linearGradient id="disk"><stop stop-color="#6c6bcb"/><stop offset=".4" stop-color="#a3a0e2"/><stop offset=".55" stop-color="#6668bf"/><stop offset="1" stop-color="#35358a"/></linearGradient><linearGradient id="metal"><stop stop-color="#bfc7d6"/><stop offset=".4" stop-color="#fff"/><stop offset="1" stop-color="#c0c7d5"/></linearGradient></defs><path d="M3 3h49v49H3z" fill="url(#disk)" stroke="#383984" stroke-width="2"/><rect x="12" y="3" width="29" height="23" rx="2" fill="url(#metal)" stroke="#6e739b"/><rect x="13" y="37" width="29" height="15" fill="#d8ddec" stroke="#45458d"/><rect x="21" y="40" width="10" height="12" fill="#5e62b0" stroke="#fff"/></svg>',
    Clear:
      '<svg viewBox="0 0 56 56" width="56" height="56"><defs><linearGradient id="cross" x2=".7" y2="1"><stop stop-color="#ffb8a4"/><stop offset=".4" stop-color="#f26c4e"/><stop offset=".55" stop-color="#ec4028"/><stop offset="1" stop-color="#cb210d"/></linearGradient></defs><path d="M4 11l7-7 17 17L45 4l7 7-17 17 17 17-7 7-17-17-17 17-7-7 17-17z" fill="url(#cross)" stroke="#d34c31" stroke-width="2"/><path d="M6 11l5-5 17 17M45 6l5 5-17 17" fill="none" stroke="#ffcec1"/></svg>',
    Print:
      '<svg viewBox="0 0 62 58" width="62" height="58"><defs><linearGradient id="printer" x2="0" y2="1"><stop stop-color="#fff"/><stop offset=".4" stop-color="#e0e6ef"/><stop offset="1" stop-color="#a0adbc"/></linearGradient></defs><rect x="16" y="2" width="32" height="24" fill="url(#printer)" stroke="#7892b1" stroke-width="2"/><rect x="3" y="23" width="57" height="27" rx="4" fill="url(#printer)" stroke="#77899c" stroke-width="2"/><path d="M7 27h49v17H7z" fill="#eff4fa"/><rect x="16" y="42" width="32" height="15" fill="url(#printer)" stroke="#7187a1" stroke-width="2"/><path d="M20 46h24M20 50h24M20 53h24" stroke="#6e849b"/></svg>',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const top = u.el('header', 'ds-top', content);
      const ic = u.el('span', 'xp-appicon', top);
      ic.innerHTML =
        '<svg viewBox="0 0 26 27"><rect x="1" y="1" width="24" height="25" rx="1" fill="#fff" stroke="#a3a3a3"/><path d="M1 2h24v6H1z" fill="#c43e1e"/><path d="M6 0v5M19 0v5" stroke="#ccc" stroke-width="2"/><path d="M4 11h3v3H4zM10 11h3v3h-3zM16 11h3v3h-3zM4 17h3v3H4zM10 17h3v3h-3zM16 17h3v3h-3zM4 22h3v2H4zM10 22h3v2h-3zM16 22h3v2h-3z" fill="#7d7d7d"/></svg>';
      u.el('span', 'ds-brand', top, C.brand);
      const caps = u.el('span', 'xp-caps', top);
      u.el('i', 'xp-cap min', caps);
      u.el('i', 'xp-cap max', caps);
      u.el('i', 'xp-cap close', caps);
      const menu = u.el('nav', 'ds-menu', content);
      for (const m of C.menu) {
        const s = u.el('span', '', menu);
        s.textContent = m;
      }
      const main = u.el('div', 'ds-main', content);
      if (ctx.display !== 'hidden') {
        const panel = ctx.display === 'panel';
        if (panel) main.classList.add('ds-main-panel');
        const b = u.el(
          ctx.display === 'toast' ? 'aside' : 'aside',
          panel ? 'ds-brief' : ctx.display === 'toast' ? 'ds-header-note ds-toast' : 'ds-header-note',
          panel ? main : content,
        );
        u.el('div', 'ds-instruction', b, ctx.instruction);
        if (!panel) content.insertBefore(b, main);
      }
      const stage = u.el('main', 'ds-stage', main);
      const dec = u.el('div', 'xp-decor', main);
      const l1 = u.el('span', 'xp-dl allday', dec, 'All day event:');
      u.el('span', 'xp-chk', dec);
      const l2 = u.el('span', 'xp-dl remind', dec, 'Reminder:');
      const rs = u.el('span', 'xp-sel', dec, '15 minutes before');
      u.el('i', '', rs);
      const foot = u.el('footer', 'ds-footer', content);
      const tools = u.el('div', 'xp-tools', foot);
      C.tools.forEach((t, i) => {
        if (t === 'Print') u.el('span', 'xp-sep', tools);
        const b = u.el('span', 'xp-tool', tools);
        const ico = u.el('span', 'xp-ico', b);
        ico.innerHTML = ICONS[t];
        u.el('span', 'xp-tl', b, t);
      });
      let submit = null;
      if (!ctx.finish) {
        const endR = ctx.rng.fork('chrome/end');
        const bank =
          ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
            ? ctx.content.END_LABELS
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
        const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        const common = endR.bool(0.5);
        const label = common ? 'Submit' : labelOf(endR.pick(bank));
        const placement = common ? 'dock' : endR.pick(['dock', 'menu', 'link']);
        const makeEnd = (parent, cls, asLink) => {
          const b = u.el(asLink ? 'a' : 'button', cls, parent, label);
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
        if (placement === 'dock') submit = makeEnd(foot, 'ds-submit', false);
        else submit = makeEnd(menu, placement === 'link' ? 'ds-end-link' : 'ds-menu-end', placement === 'link');
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const options = [...new Set(bank.map(labelOf))].filter(
            (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
          );
          if (options.length) {
            const text = cr.pick(options);
            const d = u.el('button', 'ds-xtra', foot, text);
            d.type = 'button';
            d.dataset.role = 'xtra';
            d.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
          }
        }
      }
      const cancel = u.el('button', 'ds-cancel', foot, 'Cancel');
      cancel.type = 'button';
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
