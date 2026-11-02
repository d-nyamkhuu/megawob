(function () {
  'use strict';
  const TABS = [
    [
      'Tasks',
      '#4961e7',
      '<path d="M6 2h8l4 4v16H6Z" fill="currentColor"/><path d="M14 2v5h4 M9 12h6 M9 16h6" stroke="#5266db" stroke-width="1.5"/>',
    ],
    ['Notes', '#d2e0fc', '<path d="M5 3h14v18H5Z M8 8h8 M8 12h8 M8 16h8" />'],
    [
      'Hints',
      '#3bae66',
      '<path d="M12 3a6 6 0 0 0-3.5 10.9V17h7v-3.1A6 6 0 0 0 12 3Z" fill="currentColor"/><path d="M9.5 20h5"/>',
    ],
    ['Results', '#ffb620', '<path d="M3 20V13h4v7Z M10 20V8h4v12Z M17 20V3h4v17Z" fill="currentColor" stroke="none"/>'],
  ];
  const STEPS = [
    'Move your mouse around the workspace to explore the controls.',
    'Shapes may move to different positions within this area.',
    'The timer below shows the interaction time recorded so far.',
  ];
  const PAPER = {
    bg: '#3f5fcf', panel: '#fff', fg: '#141a3c', muted: '#66708a', line: '#c5cbd8',
  };

  env.site({
    name: 'design-click-control-hover-08',
    template: 'site/base',
    langs: ['en'],
    styles: ['site.css', 'paper.css'],
    design: {
      THEMES: { paper: PAPER },
      LOW_THEME: PAPER,
      ACCENTS: ['#3f51cf'],
      LOW_ACCENTS: ['#3f51cf'],
      parts: {
        'frame.layout': (base) => (_c) => {
          base(_c);
          // The notebook's side column fits the instruction at every training size.
          _c.display = _c.ctx.display || 'header';
          document.body.className = 'ref paper';
        },
        'frame.header': () => (_c) => {
          const { util: u } = _c;
          const page = u.el('main', 'pp-page', document.body);
          const header = u.el('header', 'pp-head', page);
          const title = u.el('div', 'pp-title', header);
          u.el('div', 'pp-eyebrow', title, 'Interaction Practice');
          u.el('h1', '', title, 'Mouse Tracking Challenge');
          const progress = u.el('div', 'pp-progress', header);
          u.el('span', '', progress, 'Progress');
          const bar = u.el('div', 'pp-bar', progress);
          u.el('i', '', bar);
          u.el('span', '', progress, '1 / 3');
          const card = u.el('section', 'pp-card', page);
          Object.assign(_c, { page, header, card });
        },
        'frame.nav': () => (_c) => {
          const { util: u } = _c;
          const tabs = u.el('nav', 'pp-tabs', document.body);
          TABS.forEach((t, i) => {
            const tab = u.el('div', 'pp-tab' + (i === 0 ? ' on' : ''), tabs);
            tab.style.background = t[1];
            if (i === 1) tab.style.color = '#5a6a8a';
            tab.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">' + t[2] + '</svg>';
            u.el('span', '', tab, t[0]);
          });
          const rings = u.el('div', 'pp-rings', document.body);
          for (let i = 0; i < 13; i++) u.el('i', '', rings);
        },
        'frame.instruction': (base) => (_c) => {
          base({ ..._c, header: _c.card });
          const note = _c.card.querySelector('.ref-instruction');
          if (note) note.classList.add('instruction', 'pp-banner');
          const spacer = _c.card.querySelector('.ref-spacer');
          if (spacer) spacer.remove();
        },
        'frame.controls': (base) => (_c) => {
          base(_c);
          const { decoyBtn, endBtn } = _c;
          _c.decoyBtn = (parent, text, collides) => {
            decoyBtn(parent, text, collides);
            parent.lastElementChild.classList.add('pp-xtra');
          };
          _c.endBtn = (parent, cls, text) => {
            const button = endBtn(parent, cls, text);
            button.classList.add('submit');
            if (cls === 'ref-endlink') button.classList.add('pp-end-link');
            return button;
          };
        },
        'frame.tools': (base) => (_c) => {
          base(_c);
          if (_c.headerTools.children.length) {
            _c.headerTools.classList.add('pp-header-actions');
            if (_c.submit) _c.submit.classList.add('pp-header-submit');
          } else _c.headerTools.remove();
        },
        'frame.body': () => (_c) => {
          const { card, util: u } = _c;
          const body = u.el('div', 'ref-body pp-body', card);
          const left = u.el('div', 'pp-left', body);
          const aside = u.el('aside', 'pp-how', body);
          u.el('h2', '', aside, 'How it works');
          STEPS.forEach((text, i) => {
            const row = u.el('div', 'pp-step', aside);
            u.el('b', '', row, String(i + 1));
            u.el('p', '', row, text);
          });
          const acts = u.el('div', 'pp-acts', body);
          Object.assign(_c, { body, left, aside, acts });
        },
        'frame.panel': (base) => (_c) => {
          base({ ..._c, body: _c.aside });
          const panel = _c.aside.querySelector('.ref-panel');
          if (panel) {
            panel.classList.add('instruction', 'pp-panel-note');
            panel.querySelector('.ref-panel-title').remove();
            _c.aside.prepend(panel);
          }
        },
        'frame.stage': () => (_c) => {
          const { left, util: u } = _c;
          const stage = u.el('div', 'stage pp-stage', left);
          const label = u.el('div', 'pp-area', stage);
          u.el('span', '', label, 'Movement area');
          u.el('span', '', label, 'Shapes may move to different positions within this area.');
          _c.stage = stage;
        },
        'frame.toast': (base) => (_c) => {
          base(_c);
          const note = document.querySelector('.ref-note');
          if (note) {
            note.classList.add('instruction', 'pp-toast-note');
            note.querySelector('.ref-note-x').classList.add('pp-toast-close');
            _c.aside.prepend(note);
          }
        },
        'frame.footer': (base) => (_c) => {
          base(_c);
          const foot = document.querySelector('.ref-foot');
          if (foot) {
            _c.acts.append(...foot.querySelector('.ref-tools').children);
            foot.remove();
          }
        },
        'frame.floating': (base) => (_c) => {
          base(_c);
          const dock = document.querySelector('.ref-float-dock');
          if (dock) _c.acts.append(dock);
        },
      },
    },
  });
})();
