(function () {
  'use strict';
  const palette = { bg: '#e8e8e8', panel: '#fff', fg: '#000', muted: '#333', line: '#777' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This workstation's corner note also fits its shorter windows.
      _c.display = _c.ctx.display || 'header';
      if (_c.display === 'panel' && !_c.roomy) _c.display = 'header';
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
      const menu = u.el('nav', 'ds-menu', document.body);
      u.el('span', 'ds-apple', menu, '●');
      ['File', 'Edit', 'View', 'Chart', 'Window', 'Help'].forEach((t) => u.el('span', '', menu, t));
      const title = u.el('header', 'ds-titlebar', document.body);
      u.el('span', 'ds-docicon', title, '▤');
      u.el('span', 'ds-window-title', title, 'Sales Report');
      u.el('span', 'ds-window-controls', title, '▣  ▤');
      const content = u.el('div', 'ds-content', document.body);
      Object.assign(_c, { title, content, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note', 'ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.title;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('ds-toptools');
      if (_c.submit) _c.submit.classList.add('ds-header-submit');
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-main', _c.content);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        panel.querySelector('.ref-panel-title').textContent = 'Instructions';
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      _c.stage = u.el('main', 'ds-stage', _c.body);
      const inspector = u.el('aside', 'ds-inspector', _c.body);
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
        ['Name:', 'Product Sales This Year'], ['Type:', 'Bar Chart'],
        ['Categories:', '5'], ['Values:', 'Units Sold'],
      ]);
      section('Appearance', [
        ['Bar color:', '■'], ['Show grid lines:', '☑'], ['Show value labels:', '☐'],
        ['Y-axis maximum:', '120'], ['Y-axis step:', '20'],
      ]);
      section('Font', [
        ['Chart title:', 'Chicago  ▾'], ['Label text:', 'Chicago  ▾'], ['Number labels:', 'Chicago  ▾'],
      ]);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.content.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      foot.querySelector('.ref-foot-text').remove();
      _c.content.appendChild(foot);
      _c.foot = foot;
      const dock = _c.util.el('nav', 'ds-dock', document.body);
      [
        ['▣', 'Overview'], ['▤', 'Reports'], ['▦', 'Data'],
        ['▥', 'Charts'], ['▱', 'Print'], ['⚙', 'Settings'],
      ].forEach(([ico, t], i) => {
        const item = _c.util.el('div', 'ds-dock-item' + (i === 0 ? ' selected' : ''), dock);
        _c.util.el('b', '', item, ico);
        _c.util.el('span', '', item, t);
      });
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
    name: 'design-find-fact-chart-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-find-fact-chart-04': palette },
      LOW_THEME: palette,
      ACCENTS: ['#000'],
      LOW_ACCENTS: ['#000'],
      parts,
    },
  });
})();
