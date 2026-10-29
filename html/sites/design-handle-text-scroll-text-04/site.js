(function () {
  'use strict';
  const cfg = { 'title': 'Text Exercise', 'theme': 'gnome', 'layout': 'workspace', 'tools': '' };
  env.site({
    name: 'design-handle-text-scroll-text-04',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref ' + cfg.theme + ' ' + cfg.layout;
      const desktop = u.el('div', 'desktop-bar', document.body);
      u.el('span', 'activities', desktop, 'Activities');
      u.el('span', 'desktop-app', desktop, '▣  Text Exercise');
      u.el('span', 'desktop-clock', desktop, 'Mar 8  10:24');
      u.el('span', 'desktop-status', desktop, '◉  ◖  ▣');
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head, cfg.title);
      const sub = u.el('div', 'sub', head, 'Read the text and answer');
      const controls = u.el('div', 'app-controls', head);
      controls.innerHTML = '<span>☰</span><span>−</span><span>□</span><span>×</span>';
      if (cfg.overview) {
        const ov = u.el('section', 'overview', shell);
        cfg.overview.split('|').forEach((s, i) => u.el(i === 0 ? 'h2' : 'p', '', ov, s));
      }
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      const note = u.el('div', 'instruction', center, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      work.dataset.display = ctx.display;
      const stage = u.el('div', 'stage', center);
      const foot = u.el('footer', 'footer', shell);
      u.el('span', 'ready', foot, '');
      u.el('span', 'flinks', foot, '');
      const dock = u.el('nav', 'dock-nav', foot);
      const icons = [
        '<svg viewBox="0 0 48 48"><path fill="currentColor" d="M7 21 24 6l17 15v20a3 3 0 0 1-3 3H27V29h-6v15H10a3 3 0 0 1-3-3z"/></svg>',
        '<svg viewBox="0 0 48 48"><rect x="8" y="5" width="32" height="38" rx="5" fill="currentColor"/><path d="M16 15h16M16 24h16M16 33h16" stroke="white" stroke-width="3" stroke-linecap="round"/></svg>',
        '<svg viewBox="0 0 48 48"><path fill="currentColor" d="m20 4 8 0 2 6 5 2 5-3 6 6-3 5 2 5 6 2v8l-6 2-2 5 3 5-6 6-5-3-5 2-2 6h-8l-2-6-5-2-5 3-6-6 3-5-2-5-6-2v-8l6-2 2-5-3-5 6-6 5 3 5-2z" transform="translate(2 0) scale(.9)"/><circle cx="24" cy="24" r="8" fill="#eef0f2"/></svg>',
        '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="21" fill="currentColor"/><path d="M19 18a5.5 5.5 0 1 1 9.5 3.8c-2.4 2.5-4.5 3.1-4.5 7" fill="none" stroke="white" stroke-width="3.5" stroke-linecap="round"/><circle cx="24" cy="35" r="1.8" fill="white"/></svg>',
      ];
      [
        ['Home', 0],
        ['Text', 1],
        ['Settings', 2],
        ['Help', 3],
      ].forEach((it, i) => {
        const item = u.el('div', 'dock-item' + (i === 1 ? ' active' : ''), dock);
        const icon = u.el('span', 'dock-icon', item);
        icon.innerHTML = icons[i];
        u.el('span', 'dock-label', item, it[0]);
      }); // New episode choices use independent streams; preserve the existing seeded task.
      const er = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const labels = ctx.content.END_LABELS.map(labelOf);
      const original = er.bool(0.5);
      const placement = original ? 'form' : er.pick(['header', 'dock']);
      const label = original ? 'Submit' : er.pick(labels.filter((x) => x !== 'Submit'));
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'header' ? head : placement === 'dock' ? foot : work;
        submit = u.el('button', 'submit' + (placement === 'form' ? '' : ' end-' + placement), parent, label);
        submit.type = 'button';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.dataset.role = 'submit';
        submit.addEventListener('click', ctx.submit);
        if (placement === 'header') head.classList.add('has-end');
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const choices = labels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (choices.length) {
          const text = cr.pick(choices);
          const decoy = u.el('button', 'chrome-xtra', foot, text);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        }
      }
      // Reserve space for a wrapped note before the widget fixes its anchors.
      if (!note.hidden) {
        const noteBottom = note.getBoundingClientRect().bottom - work.getBoundingClientRect().top;
        const fieldTop = Math.max(work.clientHeight * 0.355, noteBottom + 24);
        work.style.setProperty('--answer-top', fieldTop + 'px');
        work.style.setProperty('--form-end-top', fieldTop + 126 + 'px');
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
