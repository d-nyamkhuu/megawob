(function () {
  'use strict';
  const C = {
    'site': 'design-fill-form-card-06',
    'brand': 'Contact Manager',
    'title': 'Add Contact',
    'instruction': 'left',
    'rail': '',
    'menu': 'File|Edit|View|Tools|Help',
    'briefTitle': 'Feedback',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const er = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const standard = er.bool(0.5);
      const placement = standard ? 'footer' : er.pick(['toolbar', 'link']);
      const endLabel = standard ? 'Submit' : er.pick(endLabels.filter((t) => t !== 'Submit'));
      let nav = null;
      const top = u.el('header', 'ds-top', document.body);
      const brand = u.el('span', 'ds-brand', top);
      u.el('i', '', brand);
      u.el('span', '', brand, C.brand);
      const wc = u.el('span', 'ds-wc', top);
      u.el('b', '', wc);
      u.el('b', 'mx', wc);
      u.el('b', 'cl', wc);
      if (C.menu) {
        nav = u.el('nav', 'ds-menu', document.body);
        C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      }
      const ribbon = document.createElement('div');
      const paths = {
        person: 'M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10M3 24c0-12 18-12 18 0M22 8v10M17 13h10',
        edit: 'M5 2h14v22H5zM10 17l10-10 4 4-10 10-5 1z',
        delete: 'M5 4l17 18M22 4L5 22',
        import: 'M5 1h13l5 5v19H5zM14 7v12m-5-5 5 5 5-5',
        export: 'M5 1h13l5 5v19H5zM14 19V7m-5 5 5-5 5 5',
        group:
          'M7 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M19 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M0 25c0-13 14-13 14 0M14 25c0-13 14-13 14 0',
        grid: 'M2 2h10v10H2zM16 2h10v10H16zM2 16h10v10H2zM16 16h10v10H16z',
        gear: 'M14 6v-5M14 27v-5M6 14H1M27 14h-5M8 8 4 4M24 24l-4-4M8 20l-4 4M24 4l-4 4M14 6a8 8 0 1 0 0 16 8 8 0 0 0 0-16',
        help: 'M14 2a12 12 0 1 0 0 24 12 12 0 0 0 0-24M10 9c1-7 12-3 6 2l-2 2v3M14 21v-1',
      };
      [
        ['New Contact', 'person'],
        ['Edit', 'edit'],
        ['Delete', 'delete'],
        ['Import', 'import'],
        ['Export', 'export'],
        ['Address Book', 'group'],
        ['Categories', 'grid'],
        ['Options', 'gear'],
        ['Help', 'help'],
      ].forEach(([label, key]) => {
        const b = u.el('button', 'ds-ribbon-item', ribbon);
        b.type = 'button';
        b.innerHTML =
          '<svg viewBox="-2 -2 32 32" width="38" height="38"><path d="' +
          paths[key] +
          '" fill="' +
          (key === 'grid' ? '#efbf3e' : '#9fc5e5') +
          '" stroke="' +
          (key === 'delete' ? '#bd514d' : '#4f7598') +
          '" stroke-width="2" stroke-linejoin="round"/></svg>';
        u.el('span', '', b, label);
      });
      const items = [...ribbon.children];
      [
        ['Manage', 3],
        ['Data', 2],
        ['Organize', 2],
        ['Support', 2],
      ].forEach(([label, n]) => {
        const g = u.el('div', 'ds-ribbon-group', ribbon);
        for (let i = 0; i < n; i++) g.append(items.shift());
        u.el('span', 'ds-ribbon-caption', g, label);
      });
      const body = u.el('div', 'ds-body', document.body);
      if (C.rail) {
        const rail = u.el('aside', 'ds-rail', body);
        C.rail.split('|').forEach((t) => u.el('div', '', rail, t));
      }
      const content = u.el('div', 'ds-content', body);
      const natural = C.instruction;
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'left'
              : natural;
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle);
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'top') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      if (mode === 'left' || mode === 'right') {
        const b = briefing(main, 'ds-brief');
        if (mode === 'right') b.style.order = '2';
      }
      const left = u.el('div', 'ds-left', main);
      const stage = u.el('main', 'ds-stage', left);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', left);
      u.el('span', '', foot, 'Ready');
      const tools = u.el('div', 'ds-menu-tools', nav || top);
      let submit = null;
      if (!ctx.finish) {
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          'ds-submit' + (placement === 'toolbar' ? ' ds-end-toolbar' : placement === 'link' ? ' ds-end-link' : ''),
          placement === 'toolbar' ? tools : foot,
          endLabel,
        );
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.dataset.role = 'submit';
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const pool = endLabels.filter((t) => t.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (pool.length) {
          const label = cr.pick(pool);
          const decoy = u.el('button', 'ds-end-xtra', tools, label);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        }
      }
      const cancel = u.el('button', 'ds-cancel', foot, 'Clear');
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
