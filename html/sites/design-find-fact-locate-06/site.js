(function () {
  'use strict';
  const palette = { bg: '#d8d8d8', panel: '#ffffff', fg: '#111111', muted: '#555555', line: '#b5b5b5' };
  const parts = {
    'frame.theme': (base) => (_c) => {
      // Keep frame variation independent of the document widget's random stream.
      const ctx = _c.ctx;
      _c.ctx = { ...ctx, rng: ctx.rng.fork('chrome/site') };
      base(_c);
      _c.ctx = ctx;
    },
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The reader has room for its compact note in each original display mode.
      _c.display = _c.ctx.display || 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const title = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-appicon', title, '▣');
      u.el('span', 'ds-brand', title, 'Facilities Handbook.pdf - Document Viewer');
      u.el('span', 'ds-window-controls', title, '−　□　×');
      const menu = u.el('nav', 'ds-menu', document.body);
      ['File', 'Edit', 'View', 'Go', 'Tools', 'Help'].forEach((t) => u.el('span', '', menu, t));
      const bar = u.el('div', 'ds-toolbar', document.body);
      u.el('span', 'ds-toolicon', bar, '▱');
      u.el('span', '', bar, 'Open');
      u.el('span', 'ds-toolicon', bar, '▤');
      u.el('span', '', bar, 'Print');
      u.el('i', 'ds-sep', bar);
      u.el('span', 'ds-toolicon', bar, '‹');
      u.el('span', '', bar, 'Previous');
      u.el('span', 'ds-toolicon', bar, '›');
      u.el('span', '', bar, 'Next');
      u.el('i', 'ds-sep', bar);
      u.el('span', 'ds-toolicon', bar, '⌕');
      u.el('span', '', bar, 'Find (Ctrl+F)');
      u.el('span', 'ds-fit', bar, '▣　Fit Width⌄');
      const content = u.el('div', 'ds-content', document.body);
      Object.assign(_c, { header: title, contentPane: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.contentPane;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.contentPane; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const heading = _c.body.querySelector('.ref-panel-title');
      if (heading) heading.textContent = 'Task';
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const stage = u.el('main', 'ds-stage', _c.body);
      const rail = u.el('aside', 'ds-docnav', stage);
      u.el('strong', '', rail, 'Document');
      [
        '1. Phone Extensions',
        '2. Building Access',
        '3. IT Support',
        '4. Facilities Services',
        '5. Safety and Security',
        '6. Meeting Rooms',
        '7. General Information',
      ].forEach((x, i) => u.el('div', i ? '' : 'active', rail, (i ? '›　' : '⌄　') + x));
      u.el(
        'aside',
        'ds-tips',
        stage,
        'Tips\n\n•　Use the Find button (Ctrl+F) to search for a term on the page.\n\n•　The document has 7 sections. You can expand a section to read more details.\n\n•　Scroll within the document pane if needed.\n\n•　The term you’re looking for appears exactly once in the document.',
      );
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.body.insertBefore(note, _c.stage);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      _c.body.appendChild(foot);
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
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
  };
  env.site({
    name: 'design-find-fact-locate-06',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-find-fact-locate-06': palette },
      LOW_THEME: palette,
      ACCENTS: ['#333333'],
      LOW_ACCENTS: ['#333333'],
      parts,
    },
  });
})();
