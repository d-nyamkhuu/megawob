// Design on templates/site/base.js: industrial desktop chrome.
(function () {
  'use strict';

  const parts = {
    'frame.theme': (base) => function (_c) {
      base(_c);
      const root = document.documentElement;
      for (const [k, v] of Object.entries({ bg: '#d2d0c7', panel: '#e4e2dc', fg: '#14131c', muted: '#6b6974', line: '#96948f' })) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', '#8a1825');
      root.dataset.theme = 'industrial';
    },
    'frame.header': () => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task industrial-titlebar', document.body);
      util.el('span', 'industrial-appicon', header, '▧');
      util.el('strong', 'industrial-title', header, 'Launch Desk — Workroom');
      const toolbar = util.el('div', 'industrial-tools', header);
      const controls = util.el('div', 'industrial-window-controls', header);
      for (const [cls, txt] of [['min', '_'], ['max', '□'], ['close', '×']]) util.el('span', `industrial-win ${cls}`, controls, txt);
      Object.assign(_c, { header, toolbar });
    },
    'frame.nav': () => function () {},
    'frame.instruction': (base) => function (_c) {
      base(_c);
      _c.header.querySelector('.ref-instruction')?.classList.add('industrial-instruction');
    },
    'frame.tools': (base) => function (_c) {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body industrial-body', document.body);
      const sheet = util.el('section', 'industrial-sheet', body);
      const side = util.el('aside', 'industrial-records', body);
      util.el('h2', 'industrial-sectionhead', side, 'Related Records');
      const records = util.el('div', 'industrial-record-list', side);
      for (const [i, pair] of [['Launch Plan', '2024-03-10'], ['Build 1.4.0-rc1', '2024-03-14'], ['Release Notes', '2024-03-14'], ['QA Test Plan', '2024-03-12'], ['Marketing Brief', '2024-03-11'], ['Partner Update (Acme Inc.)', '2024-03-09'], ['Go / No-Go Checklist', '2024-03-08'], ['Announcement Draft', '2024-03-13'], ['Docs Status', '2024-03-12'], ['Artifact Checksums', '2024-03-14'], ['Rollback Plan', '2024-03-07'], ['Customer FAQ', '2024-03-11']].entries()) {
        const row = util.el('div', `industrial-record${i === 0 ? ' selected' : ''}`, records);
        util.el('span', '', row, pair[0]);
        util.el('span', '', row, pair[1]);
      }
      Object.assign(_c, { body, sheet, side });
    },
    'frame.panel': (base) => function (_c) {
      const body = _c.body;
      _c.body = _c.side;
      base(_c);
      _c.body = body;
      _c.side.querySelector('.ref-panel')?.classList.add('industrial-note-panel');
    },
    'frame.stage': (base) => function (_c) {
      const body = _c.body;
      _c.body = _c.sheet;
      base(_c);
      _c.body = body;
      _c.stage.classList.add('industrial-stage');
      _c.stage.style.justifyContent = 'stretch';
      _c.stage.style.alignItems = 'stretch';
    },
    'frame.toast': (base) => function (_c) {
      base(_c);
      document.querySelector('.ref-note')?.classList.add('industrial-toast');
    },
    'frame.footer': (base) => function (_c) {
      base(_c);
      const foot = document.querySelector('.ref-foot');
      if (foot) {
        foot.classList.add('industrial-foot');
        foot.querySelector('.ref-foot-text').textContent = 'Launch Desk · Workroom';
        _c.sheet.appendChild(foot);
      }
    },
    'frame.floating': (base) => function (_c) {
      base(_c);
      document.querySelector('.ref-float-dock')?.classList.add('industrial-dock');
    },
  };

  env.site({
    name: 'design-resist-injection-chat-05',
    template: 'site/base',
    design: { parts },
  });
})();
