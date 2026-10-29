(function () {
  'use strict';
  const cfg = { 'title': 'Text Transfer Utility', 'theme': 'vista', 'layout': 'stack', 'tools': '', 'rail': '' };
  env.site({
    name: 'design-handle-text-copy-paste-05',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref ' + cfg.theme + ' ' + cfg.layout;
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head, cfg.title);
      if (
        ['qt', 'openlook', 'win92', 'clearlooks', 'industrial', 'electron', 'yosemite', 'vista'].includes(cfg.theme)
      ) {
        const controls = u.el('span', 'window-controls', title);
        controls.innerHTML =
          '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      }
      if (cfg.tools) u.el('div', 'tools', head, cfg.tools);
      if (cfg.overview) {
        const ov = u.el('section', 'overview', shell);
        cfg.overview.split('|').forEach((s, i) => u.el(i === 0 ? 'h2' : 'p', '', ov, s));
      }
      const tools = head.querySelector('.tools');
      if (tools) head.insertBefore(tools, title);
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      const note = u.el('div', 'instruction', center, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'panel') note.classList.add('instruction-panel');
      if (ctx.display === 'toast') note.classList.add('vista-toast-note');
      const stage = u.el('div', 'stage', center);
      const foot = u.el('footer', 'footer', shell);
      const clear = u.el('button', 'clear', foot, 'Clear');
      clear.type = 'button';
      clear.addEventListener('click', () => {
        const input = shell.querySelector('.ut-input');
        if (input) {
          input.value = '';
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.focus();
        }
      });
      u.el('span', 'ready', foot, 'Ready.');
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        const labels = ctx.content.END_LABELS;
        const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        const label = er.bool(0.8) ? 'Submit' : labelOf(er.pick(labels));
        const placement = er.pick(['footer', 'footer', 'footer', 'footer', 'link', 'left', 'icon']);
        const makeEnd = (parent, cls, text) => {
          const isLink = cls === 'submit-link';
          const b = u.el(isLink ? 'a' : 'button', cls, parent, text);
          if (b.tagName === 'BUTTON') b.type = 'button';
          else b.href = '#';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
          return b;
        };
        const collideRng = ctx.rng.fork('chrome/collide');
        let collide = null;
        if (collideRng.bool(0.3)) {
          const pool = labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (pool.length) collide = labelOf(collideRng.pick(pool));
        }
        if (collide) {
          const decoy = u.el('button', 'end-xtra', foot, collide);
          decoy.type = 'button';
          decoy.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
        }
        if (placement === 'link') submit = makeEnd(foot, 'submit-link', label + ' ›');
        else if (placement === 'icon') submit = makeEnd(foot, 'submit submit-icon', '✓');
        else if (placement === 'left') submit = makeEnd(foot, 'submit submit-left', label);
        else submit = makeEnd(foot, 'submit', label);
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
