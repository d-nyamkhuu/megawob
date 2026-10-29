(function () {
  'use strict';
  const C = {
    site: 'design-find-fact-count-06',
    brand: 'Product Library',
    menu: 'File|Edit|View|Go|Tools|Help',
    tabs: 'Overview|Products|Documentation|Support|Reports',
  };
  env.site({
    name: C.site,
    styles: ['site.css', 'motif.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const u = ctx.util;
      const frame = u.el('div', 'motif-frame', document.body);
      const top = u.el('header', 'ds-top', frame);
      u.el('span', 'window-icon', top, '▤');
      u.el('span', 'ds-brand', top, C.brand);
      const note = ctx.display === 'header' ? u.el('div', 'ds-instruction title-note', top, ctx.instruction) : null;
      const controls = u.el('span', 'window-controls', top);
      ['−', '□', '×'].forEach((x) => u.el('span', '', controls, x));
      const nav = u.el('nav', 'ds-menu', frame);
      C.menu.split('|').forEach((t, i) => {
        const s = u.el('span', '', nav, t);
        if (i < 3) s.innerHTML = '<u>' + t[0] + '</u>' + t.slice(1);
      });
      const tabs = u.el('div', 'ds-tabs', frame);
      C.tabs.split('|').forEach((t, i) => u.el('span', i === 1 ? 'active' : '', tabs, t));
      const work = u.el('div', 'ds-workframe', frame);
      const stage = u.el('main', 'ds-stage', work);
      const lib = u.el('aside', 'ds-library', work);
      u.el('div', 'ds-library-title', lib, 'Library');
      const tree = u.el('div', 'ds-tree', lib);
      const rows = [
        ['▾', '▣', 'Product Line', ''],
        ['', '▤', 'Introduction', 'child'],
        ['', '▤', 'Models', 'selected'],
        ['', '▤', 'Specifications', 'child'],
        ['', '▤', 'Accessories', 'child'],
        ['▸', '▤', 'Release Notes', ''],
        ['▸', '▤', 'Service & Support', ''],
        ['▸', '▤', 'Marketing', ''],
        ['▸', '▤', 'Archive', ''],
      ];
      rows.forEach(([arrow, icon, label, kind]) => {
        const row = u.el('div', 'ds-tree-row ' + kind, tree);
        u.el('span', 'ds-tree-arrow', row, arrow);
        u.el('span', 'ds-tree-icon', row, icon);
        u.el('span', 'ds-tree-label', row, label);
      });
      const toolbar = u.el('div', 'motif-toolbar', work);
      const cmds = [
        ['back', '◀', 'Back'],
        ['forward', '▶', 'Forward'],
        ['home', '⌂', 'Home'],
        ['print', '▣', 'Print'],
        ['find', '⌕', 'Find'],
        ['expand', '▦', 'Expand All'],
      ];
      cmds.forEach(([key, icon, label]) => {
        const b = u.el('button', 'motif-tool motif-tool-' + key, toolbar);
        b.type = 'button';
        b.dataset.command = key;
        u.el('span', 'motif-tool-icon', b, icon);
        u.el('span', '', b, label);
        b.addEventListener('click', () => {
          if (key === 'find') stage.querySelector('.rl-tbtn[data-key="open"]')?.click();
          if (key === 'expand') stage.querySelector('.rl-tbtn[data-key="expand"]')?.click();
          if (key === 'home') stage.querySelector('.rl-dpane')?.scrollTo({ top: 0 });
          if (key === 'back') stage.querySelector('.rl-dpane')?.scrollBy({ top: -240 });
          if (key === 'forward') stage.querySelector('.rl-dpane')?.scrollBy({ top: 240 });
        });
      });
      if (ctx.display === 'panel') {
        const p = u.el('aside', 'ds-brief', work);
        u.el('b', '', p, 'Task');
        u.el('div', 'ds-instruction', p, ctx.instruction);
      }
      const main = u.el('div', 'ds-main', frame);
      const footer = u.el('footer', 'ds-footer', frame);
      u.el('span', 'status-text', footer, 'Ready');
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
        ]
      ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name));
      const baseline = !ctx.finish && er.bool(0.5);
      const place = ctx.finish ? null : baseline ? 'footer' : er.pick(['header', 'link']);
      const label = baseline ? 'OK' : ctx.finish ? '' : er.pick(labels);
      const cr = ctx.rng.fork('chrome/collide');
      const collide =
        !ctx.finish && cr.bool(0.3) ? cr.pick(labels.filter((x) => x.toLowerCase() !== label.toLowerCase())) : null;
      const decoy = (p, t, c) => {
        const b = u.el('button', 'ds-xtra', p, t);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', c ? { label: t, collide: true } : { label: t }));
      };
      const end = (p, cls, t) => {
        const b = u.el(cls === 'ds-endlink' ? 'a' : 'button', cls, p, t);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.title = t;
        b.setAttribute('aria-label', t);
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      if (place === 'header') submit = end(top, 'ds-submit ds-header-submit', label);
      if (collide) decoy(footer, collide, true);
      if (place === 'footer') submit = end(footer, 'ds-submit', label);
      if (place === 'link') submit = end(footer, 'ds-endlink', label + ' ›');
      if (ctx.display === 'toast') {
        const toast = u.el('aside', 'ds-toast', frame);
        u.el('div', 'ds-instruction', toast, ctx.instruction);
      }
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
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
