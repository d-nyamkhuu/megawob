document.addEventListener('click', (e) => {
  const b = e.target.closest('.qt-toolbar .qt-tool');
  if (!b) return;
  const t = b.textContent.trim();
  const key = t.startsWith('Find') ? 'open' : t === 'Expand all' ? 'expand' : null;
  if (!key) return;
  const target = document.querySelector(`.rl-tbtn[data-key="${key}"]`);
  if (target) target.click();
});
(function () {
  'use strict';
  const palette = { bg: '#d4d6d8', panel: '#f7f8f9', fg: '#111820', muted: '#5d6670', line: '#aeb5bd' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
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
      const title = u.el('header', 'qt-titlebar', document.body);
      u.el('span', 'qt-appicon', title, '▤');
      u.el('span', 'qt-title', title, 'Reference Guide - Document Viewer');
      u.el('span', 'qt-window-buttons', title, '−  □  ×');
      const menu = u.el('nav', 'qt-menubar', document.body);
      ['File', 'Edit', 'View', 'Go', 'Tools', 'Help'].forEach((x, i) => u.el('span', i === 0 ? 'first' : '', menu, x));
      const toolbar = u.el('div', 'qt-toolbar', document.body);
      const tool = (icon, label, disabled) => {
        const b = u.el('button', 'qt-tool' + (disabled ? ' disabled' : ''), toolbar);
        b.type = 'button';
        u.el('b', 'qt-icon', b, icon);
        u.el('span', '', b, label);
        if (disabled) b.disabled = true;
        return b;
      };
      tool('←', 'Back');
      u.el('span', 'qt-tool-drop', toolbar, '▾');
      tool('→', 'Forward', true);
      u.el('span', 'qt-tool-drop muted', toolbar, '▾');
      u.el('i', 'qt-sep', toolbar);
      tool('⌂', 'Home');
      u.el('i', 'qt-sep', toolbar);
      tool('▤', 'Print');
      u.el('i', 'qt-sep', toolbar);
      tool('⌕', 'Find (Ctrl+F)');
      u.el('i', 'qt-sep', toolbar);
      tool('▣', 'Expand all');
      _c.header = toolbar;
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const h = _c.header;
      _c.header = document.body;
      base(_c);
      _c.header = h;
    },
    'frame.tools': (base) => (_c) => { base(_c); },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const split = u.el('div', 'qt-content', document.body);
      const side = u.el('aside', 'qt-sidebar', split);
      const tabs = u.el('div', 'qt-tabs', side);
      ['Contents', 'Index', 'Search', 'Bookmarks'].forEach((x, i) => u.el('span', i === 0 ? 'active' : '', tabs, x));
      const tree = u.el('div', 'qt-tree', side);
      u.el('div', 'qt-booktitle', tree, '▰　Product Reference Guide');
      [
        'File Types and Formats',
        'System Components',
        'Network Services',
        'User Accounts',
        'Security and Permissions',
        'Backup and Recovery',
        'Troubleshooting',
      ].forEach((x, i) => {
        const row = u.el('div', 'qt-tree-row' + (i === 0 ? ' selected' : ''), tree);
        u.el('span', 'qt-docicon', row, '▤');
        u.el('span', '', row, `${i + 1}. ${x}`);
      });
      const summary = u.el('section', 'qt-summary', side);
      u.el('h2', '', summary, 'Document Summary');
      [
        ['Sections:', '7'],
        ['Total entries:', '42'],
        ['Pages:', '28'],
        ['Last updated:', 'Mar 10, 2002'],
        ['Version:', '1.3'],
      ].forEach(([k, v]) => {
        const row = u.el('div', 'qt-summary-row', summary);
        u.el('span', '', row, k);
        u.el('span', '', row, v);
      });
      Object.assign(_c, { body: split, side });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.side;
      base(_c);
      _c.body = body;
      const title = _c.side.querySelector('.ref-panel-title');
      if (title) title.textContent = 'Task';
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => { base(_c); },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('qt-statusbar');
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
      if (_c.ctx.finish) foot.classList.add('finish');
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.foot.appendChild(dock);
        _c.foot.classList.add('qt-has-float');
      }
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'This document viewer stores preferences on this computer.',
        toast: 'Document view updated.',
        chat: 'Reference Guide support\nHow can we help?',
        promo: 'Get the latest product documentation.',
        banner: 'Scheduled maintenance: documentation search may be briefly unavailable.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-find-fact-locate-08',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-find-fact-locate-08': palette },
      LOW_THEME: palette,
      ACCENTS: ['#3c69a2'],
      LOW_ACCENTS: ['#3c69a2'],
      parts,
    },
  });
})();
