(function () {
  'use strict';
  env.site({
    name: 'design-find-fact-join-02',
    styles: ['site.css', 'design.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const top = u.el('header', 'ds-top', document.body);
      const brand = u.el('span', 'ds-brand', top);
      u.el('span', 'ds-logo', brand);
      u.el('span', '', brand, 'Acme Corp · HR');
      const win = u.el('span', 'ds-window', top);
      win.textContent = '−　□　×';
      const shell = u.el('div', 'ds-shell', document.body);
      const nav = u.el('nav', 'ds-tabs', shell);
      ['Staff', 'Departments', 'Training', 'Equipment', 'Reports'].forEach((t, i) =>
        u.el('span', i === 0 ? 'on' : '', nav, t),
      );
      const body = u.el('div', 'ds-body', shell);
      const rail = u.el('aside', 'ds-rail', body);
      ['♟|People', '▤|Organisation', '◆|Training', '▣|Documents', '▥|Reports', '⚙|Settings'].forEach((x, i) => {
        const el = u.el('div', i === 0 ? 'active' : '', rail);
        const [icon, label] = x.split('|');
        u.el('b', '', el, icon);
        u.el('span', '', el, label);
      });
      const content = u.el('div', 'ds-content', body);
      const center = u.el('div', 'ds-center', content);
      const mode = ctx.display;
      let note = null;
      if (mode === 'header') {
        note = u.el('div', 'ds-header-note', center, ctx.instruction);
      }
      const stage = u.el('main', 'ds-stage', center);
      const inspector = u.el('aside', 'ds-inspector', body);
      const block = (icon, title, fields) => {
        const h = u.el('h3', '', inspector);
        u.el('b', '', h, icon);
        u.el('span', '', h, title);
        fields.forEach((f) => {
          const row = u.el('div', 'ds-prop', inspector);
          u.el('span', '', row, f);
          u.el('i', '', row, '–');
        });
      };
      block('♟', 'Details', ['Name', 'Staff ID', 'Office', 'Department', 'Role', 'Status']);
      const line = u.el('div', 'ds-divider', inspector);
      block('◆', 'Training', ['Training ID', 'Course', 'Type', 'Date', 'Location']);
      if (mode === 'panel') {
        const p = u.el('aside', 'ds-panel', center);
        u.el('b', '', p, 'Task');
        u.el('div', '', p, ctx.instruction);
        center.insertBefore(p, stage);
      }
      if (mode === 'toast') {
        const p = u.el('aside', 'ds-toast', document.body);
        u.el('div', '', p, ctx.instruction);
        const x = u.el('button', '', p, '×');
        x.addEventListener('click', () => p.remove());
      }
      const tools = u.el('div', 'ds-tools', top);
      let submit = null;
      const er = ctx.rng.fork('chrome/end');
      const labels = (
        ctx.content.END_LABELS || ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
      ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name));
      const placement = ctx.finish ? null : er.pick(['header', 'header', 'footer', 'link', 'icon']);
      const label = ctx.finish ? '' : er.pick(labels);
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && cr.bool(0.3)) collide = cr.pick(labels.filter((x) => x !== label));
      const decoy = (parent, text) => {
        const b = u.el('button', 'ds-xtra', parent, text);
        b.onclick = () => env.log('decoy', { label: text, collide: text === collide });
      };
      const end = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.onclick = () => ctx.submit();
        return b;
      };
      if (collide) decoy(tools, collide);
      if (placement === 'header') submit = end(tools, 'ds-submit', label);
      const foot = u.el('footer', 'ds-footer', center);
      if (placement === 'footer') submit = end(foot, 'ds-submit', label);
      if (placement === 'link') {
        const a = u.el('a', 'ds-endlink', foot, label + ' ›');
        a.href = '#';
        a.dataset.role = 'submit';
        a.onclick = (e) => {
          e.preventDefault();
          ctx.submit();
        };
        submit = a;
      }
      if (placement === 'icon') submit = end(tools, 'ds-submit ds-icon', '✓');
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const b = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      b.onclick = () => ctx.dismiss('close');
      return { el, dismiss: b, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
