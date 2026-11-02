(function () {
  'use strict';
  const palette = { bg: '#b8cde4', panel: '#ffffff', fg: '#26384f', muted: '#435e7e', line: '#b8c9de' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      if (_c.ctx.display === 'panel' && _c.W >= 1200) _c.display = 'panel';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = 'office word-canvas instruction-' + _c.display;
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      const icon = u.svg('svg', { width: 26, height: 26, viewBox: '0 0 26 26', class: 'title-icon' }, top);
      u.svg('rect', { x: 3, y: 2, width: 20, height: 22, rx: 2, fill: '#e9f3ff', stroke: '#234f86', 'stroke-width': 1.5 }, icon);
      u.svg('path', { d: 'M7 7h12M7 11h12M7 15h12M7 19h9', fill: 'none', stroke: '#234f86', 'stroke-width': 1.5 }, icon);
      u.el('span', 'window-title', top, 'Project Notes - Contoso.docx - Contoso Word');
      const wc = u.el('div', 'native-window-controls', top);
      for (const [kind, label] of [['min', '−'], ['max', '□'], ['close', '×']]) {
        u.el('button', 'win-' + kind, wc, label).setAttribute('aria-label', kind);
      }
      const center = u.el('div', 'center');
      Object.assign(_c, { app, center, header: center });
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const tabs = u.el('nav', 'menu', _c.app);
      for (const tab of ['File', 'Home', 'Insert', 'Page Layout', 'References', 'Mailings', 'Review', 'View']) {
        const b = u.el('span', 'ribbon-tab' + (tab === 'Home' ? ' active' : ''), tabs, tab);
        if (tab === 'File') b.classList.add('file-tab');
      }
      const endTools = u.el('div', 'end-tools', tabs);
      const ribbon = u.el('section', 'ribbon', _c.app);
      const groups = [
        ['Clipboard', '📋', 'Paste', '✂', 'Cut', '▣', 'Copy', 'Format Painter'],
        ['Font', 'Calibri (Body)　⌄', '11　⌄', 'B　 I　 U', 'A̲', '🖍'],
        ['Paragraph', '☷', '≡', '↕', 'A↧Z', '¶'],
        ['Styles', 'AaBbCcDd', 'Normal　 Heading 1　 Heading 2　 Title'],
        ['Editing', '🔍', 'Find　⌄', 'Replace', 'Select　⌄'],
      ];
      for (const [name, ...items] of groups) {
        const g = u.el('div', 'ribbon-group', ribbon);
        const row = u.el('div', 'ribbon-tools', g);
        items.forEach((s, i) => u.el('span', 'ribbon-item item-' + i, row, s));
        u.el('div', 'group-caption', g, name);
      }
      _c.endTools = endTools;
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.endTools;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.app.appendChild(_c.center);
      _c.body = _c.center;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) panel.classList.add('brief');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('brief');
        _c.center.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const footer = u.el('footer', 'bottom', _c.app);
      u.el('span', 'status-page', footer, 'Page 1 of 1');
      u.el('span', 'status-words', footer, 'Words: 0');
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      footer.appendChild(foot);
      u.el('span', 'status-spacer', footer);
      u.el('span', 'status-view', footer, '▣　▤　▤　100%　−　━━━━●━━　＋');
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const messages = {
        cookie: 'This application stores preferences on your device.',
        toast: 'Your workspace has been synced.',
        chat: 'Need help with this exercise?',
        promo: 'Try the new practice collection.',
        banner: 'An updated practice collection is available.',
      };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-solve-puzzle-hot-cold-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#286cbd'],
      LOW_ACCENTS: ['#286cbd'],
      parts,
    },
  });
})();
