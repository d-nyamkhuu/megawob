(function () {
  'use strict';
  const cfg = {
    'title': 'Project Notebook',
    'theme': 'lisa',
    'layout': 'book',
    'menus': ['File', 'Edit', 'Document', 'Organize', 'View', 'Help'],
    'tabs': [
      ['Project', 'M5 2h14v20H5zM8 8h8M8 12h8M8 16h8'],
      ['Notes', 'M4 3h16v18H4zM7 8h10M7 11h10M7 14h10M7 17h10'],
      ['Ideas', 'M12 2a6 6 0 0 0-4 10c1 1 1 2 1 3h6c0-1 0-2 1-3a6 6 0 0 0-4-10zM9 18h6M10 21h4'],
      ['Archive', 'M3 4h18v5H3zM5 9v11h14V9M9 13h6'],
    ],
  };
  env.site({
    name: 'design-click-control-collapsible-10',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref ' + cfg.theme + ' ' + cfg.layout;
      const bar = u.el('header', 'menubar', document.body);
      const ap = u.el('span', 'apple', bar);
      ap.innerHTML =
        '<svg viewBox="0 0 16 18"><path d="M11 1c0 1.5-1 3-2.600 3.200C8.300 2.600 9.500 1.200 11 1zM8 5c1-.6 2.500-.8 3.700.3-1.800 1-1.500 3.600.5 4.400-.6 2-2.100 4.300-3.700 4.300-.8 0-1-.5-2-.5s-1.300.5-2 .5C2.500 14 1 10 2 7.500 3 5.500 5.800 4.400 8 5z"/></svg>';
      cfg.menus.forEach((m) => u.el('span', 'mi', bar, m));
      const clk = u.el('span', 'clock', bar);
      clk.innerHTML =
        '<svg viewBox="0 0 24 24"><path d="M3 3h15l3 3v15H3zM7 3v6h9V3M7 21v-7h10v7"/></svg><b>Mon Apr 22</b><b>10:24 AM</b>';
      const spiral = u.el('div', 'spiral', document.body);
      for (let i = 0; i < 11; i++) u.el('i', '', spiral);
      const rail = u.el('nav', 'rail', document.body);
      cfg.tabs.forEach((t, i) => {
        const d = u.el('div', 'tab' + (i === 0 ? ' active' : ''), rail);
        const ic = u.el('span', 'ic', d);
        ic.innerHTML = '<svg viewBox="0 0 24 24"><path d="' + t[1] + '"/></svg>';
        u.el('span', '', d, t[0]);
      });
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      u.el('div', 'title', head, cfg.title);
      u.el('div', 'subtitle', head, 'Research & Planning');
      let display = ctx.display || 'header';
      if (display === 'panel' && window.innerWidth < 1200) display = 'header';
      if (display === 'toast' && window.innerHeight < 680) display = 'header';
      const note = u.el('div', 'instruction', shell, ctx.instruction);
      note.dataset.display = display;
      note.hidden = display === 'hidden';
      if (display === 'toast') {
        note.classList.add('instruction-toast');
        head.appendChild(note);
      }
      const stage = u.el('div', 'stage', shell);
      const foot = u.el('footer', 'footer', shell);
      const act = (label, fn) => {
        const b = u.el('button', 'abtn', foot, label);
        b.type = 'button';
        b.addEventListener('click', fn);
        return b;
      };
      const heads = () => Array.from(stage.querySelectorAll('.uc-sec-h'));
      act('Expand All', () => {
        heads().forEach((h) => {
          if (h.getAttribute('aria-expanded') !== 'true') h.click();
        });
      });
      act('Collapse All', () => {
        heads().forEach((h) => {
          if (h.getAttribute('aria-expanded') === 'true') h.click();
        });
      });
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end'),
          cr = ctx.rng.fork('chrome/collide');
        const bank = ctx.content && ctx.content.END_LABELS;
        const labels =
          Array.isArray(bank) && bank.length
            ? bank
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', '✓'];
        const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        const placement = er.pick(['footer', 'footer', 'footer', 'header', 'link', 'icon']);
        const label = placement === 'footer' ? 'Submit' : er.bool(0.5) ? 'Submit' : labelOf(er.pick(labels));
        const end = (parent, kind, text) => {
          const tag = kind === 'link' ? 'a' : 'button';
          const b = u.el(
            tag,
            kind === 'link' ? 'end-link' : kind === 'icon' ? 'submit end-icon' : 'submit',
            parent,
            text,
          );
          if (tag === 'a') b.href = '#';
          else b.type = 'button';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.dataset.role = 'submit';
          b.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
          return b;
        };
        if (placement === 'footer') submit = end(foot, 'footer', label);
        else if (placement === 'link') submit = end(foot, 'link', label + ' ›');
        else if (placement === 'header') submit = end(head, 'header', label);
        else submit = end(head, 'icon', '✓');
        if (cr.bool(0.3)) {
          const pool = [
            ...new Set(labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase())),
          ];
          if (pool.length) {
            const text = labelOf(cr.pick(pool));
            const parent = cr.pick([foot, head]);
            const d = u.el('button', 'xtra', parent, text);
            d.type = 'button';
            d.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
          }
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el(
        'strong',
        '',
        el,
        {
          cookie: 'Cookie preferences',
          toast: 'Notification',
          chat: 'Support',
          promo: 'A special offer',
          banner: 'Service notice',
        }[ctx.kind],
      );
      ctx.util.el(
        'p',
        '',
        el,
        {
          cookie: 'Choose your preferences to continue.',
          toast: 'Your workspace is ready.',
          chat: 'How can we help?',
          promo: 'Explore the latest tools.',
          banner: 'A new update is available.',
        }[ctx.kind],
      );
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
