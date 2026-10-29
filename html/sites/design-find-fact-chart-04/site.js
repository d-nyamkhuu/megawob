(function () {
  'use strict';
  const C = { site: 'design-find-fact-chart-04' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const menu = u.el('nav', 'ds-menu', document.body);
      u.el('span', 'ds-apple', menu, '●');
      ['File', 'Edit', 'View', 'Chart', 'Window', 'Help'].forEach((t) => u.el('span', '', menu, t));
      const title = u.el('header', 'ds-titlebar', document.body);
      u.el('span', 'ds-docicon', title, '▤');
      u.el('span', 'ds-window-title', title, 'Sales Report');
      u.el('span', 'ds-window-controls', title, '▣  ▤');
      const content = u.el('div', 'ds-content', document.body);
      const natural = 'top';
      let mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'left'
              : natural;
      if (mode === 'left' && window.innerWidth < 1260) mode = 'top';
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, 'Instructions');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'top') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      if (mode === 'left' || mode === 'right') {
        const b = briefing(main, 'ds-brief');
        if (mode === 'right') b.style.order = '2';
      }
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const inspector = u.el('aside', 'ds-inspector', main);
      u.el('div', 'ds-inspector-head', inspector, 'Chart Properties');
      const section = (title, rows) => {
        const s = u.el('section', 'ds-inspector-section', inspector);
        u.el('h3', '', s, '▾  ' + title);
        const b = u.el('div', 'ds-inspector-body', s);
        rows.forEach(([a, v]) => {
          const row = u.el('div', 'ds-prop-row', b);
          u.el('span', '', row, a);
          u.el('span', '', row, v);
        });
      };
      section('Data Series', [
        ['Name:', 'Product Sales This Year'],
        ['Type:', 'Bar Chart'],
        ['Categories:', '5'],
        ['Values:', 'Units Sold'],
      ]);
      section('Appearance', [
        ['Bar color:', '■'],
        ['Show grid lines:', '☑'],
        ['Show value labels:', '☐'],
        ['Y-axis maximum:', '120'],
        ['Y-axis step:', '20'],
      ]);
      section('Font', [
        ['Chart title:', 'Chicago  ▾'],
        ['Label text:', 'Chicago  ▾'],
        ['Number labels:', 'Chicago  ▾'],
      ]);
      const foot = u.el('footer', 'ds-footer', content);
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
          ? 'Finish'
          : er.pick(labels.filter((x) => String(x).toLowerCase() !== 'submit'));
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
      const tools = u.el('div', 'ds-tools', foot);
      if (collide) decoy(tools, collide, true);
      if (placement === 'footer') submit = end(tools, 'ds-submit', label);
      if (placement === 'header') submit = end(title, 'ds-submit ds-header-submit', label);
      if (placement === 'link') submit = end(tools, 'ds-endlink', label + ' ›');
      const dock = u.el('nav', 'ds-dock', document.body);
      [
        ['▣', 'Overview'],
        ['▤', 'Reports'],
        ['▦', 'Data'],
        ['▥', 'Charts'],
        ['▱', 'Print'],
        ['⚙', 'Settings'],
      ].forEach(([ico, t], i) => {
        const item = u.el('div', 'ds-dock-item' + (i === 0 ? ' selected' : ''), dock);
        u.el('b', '', item, ico);
        u.el('span', '', item, t);
      });
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
