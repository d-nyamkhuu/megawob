(function () {
  'use strict';
  const C = {
    site: 'design-find-fact-count-11',
    brand: 'Technical Library',
    menu: 'File|Edit|View|Document|Tools|Window|Help',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util,
        top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-appicon', top, '✣');
      u.el('span', 'ds-brand', top, C.brand);
      const win = u.el('div', 'ds-window', top);
      u.el('button', '', win, '−');
      u.el('button', '', win, '□');
      u.el('button', '', win, '×');
      const nav = u.el('nav', 'ds-menu', document.body);
      C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      const tools = u.el('div', 'ds-toolbar', document.body);
      const toolbarIcons = {
        Open: '<svg viewBox="0 0 36 36"><path d="M7 3h16l7 7v23H7z"/><path d="M23 3v8h7M12 16h13M12 20h13M12 24h13M12 28h9"/></svg>',
        Library: '<svg viewBox="0 0 36 36"><path d="M3 10h12l3 4h15v18H3z"/><path d="M3 14h30"/></svg>',
        Print:
          '<svg viewBox="0 0 36 36"><path d="M10 12V4h16v8M9 27H5V14h26v13h-4M10 22h16v11H10z"/><path d="M26 17h2"/></svg>',
        Find: '<svg viewBox="0 0 36 36"><circle cx="15" cy="15" r="10"/><path d="m22 22 10 10"/></svg>',
      };
      [
        ['Open', 'Open'],
        ['Library', 'Library'],
        ['Print', 'Print'],
        ['Find', 'Find'],
      ].forEach(([icon, label]) => {
        const b = u.el('button', 'ds-tool', tools),
          svg = u.el('span', 'ds-tool-icon', b);
        svg.innerHTML = toolbarIcons[icon];
        u.el('span', '', b, label);
        if (label === 'Find')
          b.addEventListener('click', () => {
            const target = document.querySelector('.ds-stage .rl-tbtn');
            if (target) target.click();
          });
      });
      const summary = u.el('section', 'ds-summary', document.body);
      const cover = u.el('div', 'ds-cover', summary);
      u.el('span', 'ds-paper-icon', cover, '▤');
      const info = u.el('div', 'ds-summary-title', summary);
      u.el('strong', '', info, 'The Quartz Graphics System');
      u.el('span', '', info, 'Technical Note');
      u.el('span', '', info, 'Version 2.1');
      u.el('span', '', info, 'March 12, 1993');
      const meta = u.el('div', 'ds-summary-meta', summary);
      [
        ['Author:', 'NeXT Computer, Inc.'],
        ['Format:', 'Document'],
        ['Pages:', '12'],
        ['Size:', '542 KB'],
        ['Topic:', 'Graphics'],
      ].forEach(([a, b]) => {
        u.el('span', '', meta, a);
        u.el('span', '', meta, b);
      });
      const body = u.el('div', 'ds-body', document.body),
        rail = u.el('aside', 'ds-rail', body);
      u.el('h3', '', rail, 'Library');
      const tree = u.el('div', 'ds-tree', rail);
      [
        ['▾', '▰', 'Technical Notes', true],
        ['　', '▤', 'The Quartz Graphics System', true],
        ['　', '▤', 'Display PostScript'],
        ['　', '▤', 'Window Server Guide'],
        ['　', '▤', 'Application Kit Overview'],
        ['　', '▤', 'Sound and Media'],
        ['　', '▤', 'Networking Basics'],
        ['▸', '▰', 'Developer Guides'],
        ['▸', '▰', 'Reference'],
        ['▸', '▰', 'Release Notes'],
        ['▸', '▰', 'Samples'],
      ].forEach(([chev, icon, label, active]) => {
        const row = u.el('div', `ds-tree-row${active ? ' active' : ''}`, tree);
        u.el('span', 'ds-tree-chev', row, chev);
        u.el('span', 'ds-tree-icon', row, icon);
        u.el('span', 'ds-tree-label', row, label);
      });
      const content = u.el('div', 'ds-content', body);
      let mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'panel'
              : ctx.display === 'header'
                ? 'header'
                : 'hidden';
      if (mode === 'panel' && window.innerWidth < 1260) mode = 'header';
      function note(parent, cls) {
        const b = u.el('aside', cls, parent);
        u.el('strong', '', b, 'Task');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'header') note(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      if (mode === 'panel') note(rail, 'ds-panel-note');
      const stage = u.el('main', 'ds-stage', main);
      const inspector = u.el('aside', 'ds-inspector', main);
      const it = u.el('div', 'ds-inspector-title', inspector);
      u.el('strong', '', it, 'Document Inspector');
      u.el('span', '', it, '▴');
      u.el('h3', '', inspector, 'General');
      const facts = u.el('div', 'ds-facts', inspector);
      [
        ['Title:', 'The Quartz Graphics System'],
        ['Author:', 'NeXT Computer, Inc.'],
        ['Version:', '2.1'],
        ['Date:', 'March 12, 1993'],
        ['Pages:', '12'],
        ['Size:', '542 KB'],
        ['Topic:', 'Graphics'],
      ].forEach(([a, b]) => {
        u.el('span', '', facts, a);
        u.el('span', '', facts, b);
      });
      u.el('h3', 'ds-key-title', inspector, 'Keywords');
      const kws = u.el('div', 'ds-keywords', inspector);
      [
        'Quartz',
        'graphics',
        'rendering',
        'Window Server',
        'compositing',
        'PostScript',
        'NeXTSTEP',
        'images',
        'fonts',
      ].forEach((x) => u.el('div', '', kws, x));
      if (mode === 'toast') {
        const n = note(content, 'ds-toast');
        content.insertBefore(n, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', 'ds-ready', foot, 'Ready');
      let submit = null;
      const er = ctx.rng.fork('chrome/end');
      const labels = (
        (ctx.content && ctx.content.END_LABELS) || [
          'Submit',
          'Done',
          'Finish',
          'Continue',
          'Save',
          'OK',
          'Confirm',
          'Apply',
          'Complete',
        ]
      ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name));
      const baseline = !ctx.finish && er.bool(0.5);
      const placement = ctx.finish ? null : baseline ? 'footer' : er.pick(['header', 'link']);
      const label = ctx.finish
        ? ''
        : baseline
          ? 'Apply'
          : er.pick(labels.filter((x) => String(x).toLowerCase() !== 'apply'));
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && cr.bool(0.3)) {
        const pool = labels.filter((x) => String(x).toLowerCase() !== String(label).toLowerCase());
        if (pool.length) collide = cr.pick(pool);
      }
      const decoy = (parent, text, isCollide) => {
        const b = u.el('button', 'ds-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () =>
          env.log('decoy', isCollide ? { label: text, collide: true } : { label: text }),
        );
      };
      const end = (parent, cls, text) => {
        const b = u.el(cls === 'ds-endlink' ? 'a' : 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      const headTools = u.el('div', 'ds-head-tools', top);
      if (collide) decoy(placement === 'footer' ? foot : headTools, collide, true);
      if (placement === 'header') submit = end(headTools, 'ds-submit ds-header-submit', label);
      if (placement === 'footer') submit = end(foot, 'ds-submit', label);
      if (placement === 'link') submit = end(foot, 'ds-endlink', label + ' ›');
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
