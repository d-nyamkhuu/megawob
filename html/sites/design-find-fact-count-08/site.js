(function () {
  'use strict';
  const C = {
    site: 'design-find-fact-count-08',
    nav: ['Home', 'Documents', 'Media', 'Locations', 'Contacts', 'Calendar', 'Tasks', 'Settings'],
    sections: ['Introduction', 'North Island', 'Coral Lagoon', 'Wildlife', 'Activities', 'South Lagoon', 'Getting There', 'Travel Tips'],
  };
  const palette = { bg: '#b0dcfc', panel: '#f2f9ff', fg: '#19264b', muted: '#23466f', line: '#97ceff' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const { ctx, util: u, display } = _c;
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const shell = u.el('div', 'aero-shell', document.body);
      const rail = u.el('aside', 'aero-rail', shell);
      const icons = [
        '<path d="M3 11 12 3l9 8v10h-6v-6h-6v6H3z"/><path d="M2 11 12 2l10 9"/>',
        '<path d="M5 2h10l5 5v15H5z"/><path d="M15 2v6h5M8 12h8M8 16h8"/>',
        '<rect x="2" y="3" width="20" height="18" rx="2"/><circle cx="8" cy="9" r="2"/><path d="m4 18 6-6 4 4 3-3 3 5"/>',
        '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a16 16 0 0 1 0 20M12 2a16 16 0 0 0 0 20"/>',
        '<circle cx="9" cy="8" r="4"/><circle cx="17" cy="9" r="3"/><path d="M2 21c0-5 3-8 7-8s7 3 7 8M15 14c4 0 7 2 7 6"/>',
        '<rect x="3" y="5" width="18" height="17" rx="2"/><path d="M7 2v6M17 2v6M3 10h18M7 14h3M13 14h4"/>',
        '<rect x="4" y="3" width="16" height="19" rx="2"/><path d="m7 9 2 2 4-4M7 16l2 2 4-4"/>',
        '<circle cx="12" cy="12" r="3"/><path d="M19 13.5a7 7 0 0 0 0-3l2-1.5-2-3.5-2.3 1a8 8 0 0 0-2.5-1.5L14 2h-4l-.4 3a8 8 0 0 0-2.5 1.5l-2.3-1-2 3.5 2 1.5a7 7 0 0 0 0 3l-2 1.5 2 3.5 2.3-1a8 8 0 0 0 2.5 1.5l.4 3h4l.4-3a8 8 0 0 0 2.5-1.5l2.3 1 2-3.5z"/>',
      ];
      C.nav.forEach((label, i) => {
        const item = u.el('div', 'aero-navitem' + (i === 1 ? ' selected' : ''), rail);
        const icon = u.el('span', 'aero-icon', item);
        icon.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' + icons[i] + '</svg>';
        u.el('span', '', item, label);
      });
      const content = u.el('div', 'aero-content', shell);
      const main = u.el('div', 'aero-main', content);
      const inspector = u.el('aside', 'aero-inspector', main);
      u.el('div', 'aero-inspector-head', inspector, 'Document Details');
      const details = u.el('div', 'aero-details', inspector);
      u.el('div', 'aero-island-thumb', details);
      u.el('strong', 'aero-docname', details, 'Island Guide');
      u.el('div', 'aero-subtitle', details, 'Travel Guide');
      const meta = u.el('div', 'aero-meta', details);
      [
        ['Type:', 'Article'], ['Size:', '428 KB'], ['Modified:', 'Mar 14, 2006'],
        ['Language:', 'English'], ['Author:', 'R. Bennett'], ['Tags:', 'islands, travel, beaches, lagoon'],
      ].forEach(([k, v]) => {
        const row = u.el('div', 'aero-metarow', meta);
        u.el('span', '', row, k);
        u.el('span', k === 'Tags:' ? 'aero-tags' : '', row, v);
      });
      const sectionbox = u.el('div', 'aero-sections', inspector);
      u.el('div', 'aero-sections-head', sectionbox, 'Sections');
      const sl = u.el('div', 'aero-section-links', sectionbox);
      C.sections.forEach((s, i) => {
        const a = u.el('div', 'aero-section-link' + (!i ? ' active' : ''), sl);
        u.el('span', 'aero-page-icon', a, '▤');
        u.el('span', '', a, i + 1 + '. ' + s);
      });
      if (display === 'panel') details.style.display = 'none';
      const workspace = u.el('div', 'aero-workspace', main);
      Object.assign(_c, { shell, main, inspector, workspace, header: workspace });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('aero-header-note');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.workspace;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('aero-header-actions');
      if (_c.placement === 'icon') _c.headerTools.classList.add('aero-icon-actions');
    },
    'frame.body': () => (_c) => { _c.body = _c.main; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.inspector;
      base(_c);
      _c.body = body;
      const note = _c.inspector.querySelector('.ref-panel');
      if (note) {
        note.classList.add('aero-panel-note');
        note.querySelector('.ref-panel-title').textContent = 'Task';
      }
    },
    'frame.stage': () => (_c) => {
      const { util: u, workspace, display, placement, ctx } = _c;
      const stagewrap = u.el('div', 'aero-taskarea', workspace);
      const titlebar = u.el('div', 'aero-titlebar', stagewrap);
      u.el('div', 'aero-title', titlebar, 'Island Guide');
      const stage = u.el('main', 'ds-stage', stagewrap);
      if (ctx.finish) stagewrap.classList.add('aero-finish');
      if (display === 'header') stagewrap.classList.add('aero-has-note');
      if (display === 'panel') stagewrap.classList.add('aero-has-panel-note');
      if (placement === 'header' || placement === 'icon') stagewrap.classList.add('aero-has-header-end');
      if (placement === 'footer' || placement === 'link') stagewrap.classList.add('aero-has-footer-end');
      if (display === 'toast') stagewrap.classList.add('aero-has-toast');
      Object.assign(_c, { stagewrap, stage });
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('aero-toast');
        _c.workspace.insertBefore(note, _c.workspace.firstChild);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.stagewrap.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.headerTools.classList.add('aero-floating-actions');
        _c.headerTools.insertBefore(dock, _c.headerTools.firstChild);
      }
      const foot = _c.stagewrap.querySelector('.ref-foot');
      // Reserve the answer strip beside the footer controls.
      const width = foot ? foot.getBoundingClientRect().width : 0;
      if (width) {
        _c.stagewrap.classList.add('aero-bottom-tools');
        _c.stagewrap.style.setProperty('--aero-tools-width', (width + 26) + 'px');
      }
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('section', 'ds-overlay aero-overlay aero-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Discover more from Island Guide.',
        banner: 'Island Guide service announcement.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: C.site,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-find-fact-count-08': palette }, LOW_THEME: palette,
      ACCENTS: ['#58b1ef'], LOW_ACCENTS: ['#58b1ef'], parts,
    },
  });
})();
