(function () {
  'use strict';
  const C = {
    'brand': 'TaskCenter',
    'tag': 'Simple Tools for Everyday Work',
    'date': 'Mon, Apr 28, 2003   10:14 AM',
  };
  const POSTS = [
    [
      'alice',
      'Apr 28, 2003  9:52 AM',
      '#1',
      0,
      "I'm new to this workspace. Is the text field below ready to use?",
    ],
    [
      'bob',
      'Apr 28, 2003  9:55 AM',
      '#2',
      1,
      'Yes, the text field is available. You can review your entry before finishing.',
    ],
    ['carol', 'Apr 28, 2003  9:58 AM', '#3', 2, 'The field supports letters, numbers, spaces and punctuation. You can edit your entry at any time.'],
    [
      'dave',
      'Apr 28, 2003  10:01 AM',
      '#4',
      2,
      "I noticed the quick action button is disabled. It is currently unavailable in this workspace.",
    ],
  ];
  // Keep the forum shell; site/base supplies the shared frame behavior.
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // Both instruction treatments fit inside the task pane at every viewport.
      _c.display = _c.ctx.display || 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      // The reference has a permanent status bar and no navigation or sidebar.
      Object.assign(_c, { wantFooter: true, nav: false, sidebar: false });
    },
    'frame.header': () => (_c) => {
      const { util: u } = _c;
      const top = u.el('header', 'ds-top', document.body);
      const lt = u.el('span', 'ds-topl', top);
      u.el('b', 'ds-brand', lt, C.brand);
      u.el('i', 'ds-bar', lt, '|');
      u.el('span', 'ds-tag', lt, C.tag);
      u.el('span', 'ds-date', top, C.date);
      const body = u.el('div', 'ds-body ref-body', document.body);
      const left = u.el('section', 'ds-pane ds-left', body);
      u.el('div', 'ds-bar-h', left, 'Task Instructions');
      const header = u.el('div', 'ds-pane-body', left);
      Object.assign(_c, { body, header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const instruction = _c.header.querySelector('.ref-instruction');
      if (instruction) instruction.className = 'ds-instruction';
      _c.header.querySelector('.ref-spacer')?.remove();
    },
    'frame.tools': (base) => (_c) => {
      const acts = _c.util.el('div', 'ds-acts', _c.header);
      const controls = { ..._c, header: acts };
      base(controls);
      Object.assign(_c, { acts, headerTools: controls.headerTools, submit: controls.submit });
      if (_c.submit) _c.submit.classList.add('ds-submit');
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      base({ ..._c, body: _c.header });
      const panel = _c.header.querySelector('.ref-panel');
      if (panel) {
        panel.className = 'ds-instruction ds-panelnote';
        panel.replaceChildren(panel.querySelector('.ref-panel-text'));
        panel.firstChild.className = '';
        _c.header.prepend(panel);
      }
      _c.header.classList.remove('ref-panel-right');
    },
    'frame.stage': () => (_c) => {
      const { acts, body, display, header: lc, util: u } = _c;
      if (display !== 'hidden') {
        const lead = u.el('p', 'ds-lead', lc, 'Use the text field below to enter and review your response.');
        acts.before(lead);
        _c.lead = lead;
      }
      const box = u.el('div', 'ds-box', lc);
      acts.before(box);
      const source = u.el('div', 'ds-srcrow', box);
      u.el('span', 'ds-srclab', source, 'Source string:');
      u.el('span', 'ds-srcval', source);
      const stage = u.el('main', 'ds-stage', box);
      const q = u.el('button', 'ds-quick', acts, 'Quick action');
      q.type = 'button';
      q.disabled = true;
      u.el('span', 'ds-unavail', acts, '(currently unavailable)');
      u.el('hr', 'ds-rule', lc);
      u.el('div', 'ds-notes-h', lc, 'Notes:');
      const ul = u.el('ul', 'ds-notes', lc);
      [
        'The text field supports ordinary typing.',
        'You can edit your entry before finishing.',
        'Quick action is unavailable in this workspace.',
      ].forEach((t) => u.el('li', '', ul, t));
      const right = u.el('section', 'ds-pane ds-right', body);
      u.el('div', 'ds-bar-h', right, 'Discussion');
      const rc = u.el('div', 'ds-pane-body ds-thread', right);
      POSTS.forEach((p) => {
        const post = u.el('div', 'ds-post ds-lv' + p[3], rc);
        const h = u.el('div', 'ds-post-h', post);
        u.el('b', '', h, p[0]);
        u.el('span', 'ds-post-d', h, p[1]);
        u.el('span', 'ds-post-n', h, p[2]);
        u.el('div', 'ds-post-b', post, p[4]);
      });
      Object.assign(_c, { stage });
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.querySelector('.ref-note');
      if (note) {
        note.className = 'ds-instruction ds-toast';
        _c.lead.before(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.querySelector('.ref-foot');
      foot.className = 'ds-footer';
      const fl = foot.querySelector('.ref-foot-text');
      fl.textContent = 'TaskCenter v1.0';
      _c.util.el('i', '', fl, '|');
      _c.util.el('span', '', fl, 'Help');
      _c.util.el('i', '', fl, '|');
      _c.util.el('span', '', fl, 'Contact');
      if (_c.submit && foot.contains(_c.submit)) {
        _c.submit.classList.add(_c.placement === 'link' ? 'ds-foot-link' : 'ds-foot-submit');
      }
      _c.util.el('span', 'ds-ready', foot, 'Ready');
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.querySelector('.ref-float-dock');
      if (dock) {
        _c.foot.before(dock);
        _c.submit.classList.add('ds-submit');
      }
    },
  };

  const palette = { bg: '#f6f8fa', panel: '#fff', fg: '#191d32', muted: '#6a7184', line: '#9fb2c9' };
  env.site({
    name: 'design-type-text-transform-12',
    template: 'site/base',
    design: {
      THEMES: { light: palette },
      LOW_THEME: palette,
      ACCENTS: ['#2a5a9c'],
      LOW_ACCENTS: ['#2a5a9c'],
      parts,
    },
  });
})();
