/* Maple Creek Corner: a 1996 homepage design on the shared site frame. */
(function () {
  'use strict';

  function icon(u, parent, cls, asset) {
    const span = u.el('span', cls, parent);
    const img = u.el('img', '', span);
    img.src = 'sites/design-set-slider-vertical-10/assets/' + asset + '.webp';
    img.alt = '';
    return span;
  }

  function feedback(u) {
    const fb = u.el('aside', 'panel feedback', document.body);
    const bar = u.el('div', 'panel-bar', fb);
    icon(u, bar, 'ico mail', 'mail');
    u.el('span', '', bar, 'Visitor Feedback');
    u.el('p', 'fb-intro', fb, 'I’d love to hear from you!');
    const opts = u.el('div', 'fb-opts', fb);
    for (const text of ['Great site!', 'Nice photos', 'Useful links', 'Interesting', 'Other']) {
      const row = u.el('div', 'opt', opts);
      u.el('i', '', row);
      u.el('span', '', row, text);
    }
    const comments = u.el('div', 'fb-area', fb, 'Any comments?');
    const scrollbar = u.el('span', 'fb-scrollbar', comments);
    u.el('i', 'scroll-up', scrollbar, '▲');
    u.el('i', 'scroll-down', scrollbar, '▼');
    const send = u.el('button', 'send', fb, 'Send Feedback');
    send.type = 'button';
    const foot = u.el('div', 'fb-foot', fb);
    icon(u, foot, 'paw', 'paw');
    u.el('span', '', foot, 'Small pages.\nBrighter days.');
  }

  const paper = { bg: '#f0eee6', panel: '#ece9e0', fg: '#151515', muted: '#4a4a48', line: '#9a9a96' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The fixed task-note region fits even at the smallest training viewport.
      _c.display = _c.ctx.display;
      document.body.className = `library instruction-${_c.display}`;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const welcome = u.el('div', 'welcome', document.body);
      u.el('h3', '', welcome, 'Welcome, Friend!');
      u.el('p', '', welcome,
        'This is my little corner of the internet. I collect nature photos, write short notes, and share useful links. Thanks for stopping by!');
      icon(u, welcome, 'flower', 'flower');
      const mast = u.el('header', 'masthead', document.body);
      icon(u, mast, 'tree tl', 'tree');
      u.el('h1', '', mast, 'Maple Creek Corner');
      icon(u, mast, 'tree tr', 'tree');
      const sub = u.el('div', 'tagline', mast);
      u.el('span', '', sub, 'A Little Place on the Web');
      const badge = u.el('div', 'badge', document.body);
      u.el('span', '', badge, 'Good things\nhappen online.');
      icon(u, badge, 'house', 'house');
      const body = u.el('section', 'panel main-panel ref-body', document.body);
      const header = u.el('div', 'panel-bar', body);
      icon(u, header, 'ico', 'tree');
      u.el('span', '', header, 'Today’s Interactive Corner');
      Object.assign(_c, { body, header });
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const nav = u.el('nav', 'links', document.body);
      ['Home', 'Photos', 'Journal', 'Links', 'Guestbook'].forEach((text, i) => {
        if (i) u.el('span', 'bar', nav, '|');
        const link = u.el('a', '', nav, text);
        link.href = '#';
        link.onclick = (e) => {
          e.preventDefault();
          env.log('decoy', { what: 'nav', label: text });
        };
      });
    },
    'frame.instruction': (base) => (_c) => {
      base({ ..._c, header: _c.body });
      const instruction = _c.body.querySelector('.ref-instruction');
      if (!instruction) {
        _c.body.querySelector('.ref-spacer').remove();
        return;
      }
      instruction.className = 'instruction';
      const split = _c.ctx.instruction.match(/^(.+?[.!?])\s+((?:Use|Drag|Track|Click|Only|Do not).*)$/);
      instruction.textContent = '';
      _c.util.el('span', 'instruction-main', instruction, split ? split[1] : _c.ctx.instruction);
      if (split) _c.util.el('span', 'instruction-detail', instruction, split[2]);
    },
    'frame.controls': (base) => (_c) => {
      base(_c);
      const { endBtn, decoyBtn } = _c;
      _c.endBtn = (parent, cls, text) => {
        const button = endBtn(parent, cls, text);
        button.classList.add(cls === 'ref-endlink' ? 'end-link' : 'primary');
        if (parent.closest('.panel-bar')) button.classList.add('chrome-end');
        return button;
      };
      _c.decoyBtn = (parent, text, collides) => {
        decoyBtn(parent, text, collides);
        parent.lastElementChild.classList.add('chrome-xtra');
      };
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      const { util: u, body } = _c;
      const photo = u.el('figure', 'photo', body);
      icon(u, photo, 'frame', 'lake');
      u.el('figcaption', '', photo, 'Maple Creek Lake\nOne of my favorite places.');
      const about = u.el('aside', 'about', body);
      const title = u.el('h4', '', about, 'About This Control');
      if (_c.display === 'panel') {
        base({ ..._c, body: about });
        const panel = about.querySelector('.ref-panel');
        title.textContent = 'Today’s Task Note';
        about.classList.add('about-instruction');
        const text = panel.querySelector('.ref-panel-text');
        text.className = 'about-task-text';
        about.append(text);
        panel.remove();
      } else {
        u.el('p', 'about-copy', about, 'This slider adjusts how quickly the slideshow advances through photos.');
        u.el('hr', 'about-rule', about);
        u.el('p', 'about-copy', about, 'Drag the handle on the left to adjust the current value.');
      }
      feedback(u);
    },
    'frame.stage': () => (_c) => {
      const stage = _c.util.el('main', 'record-stage', _c.body);
      stage.dataset.role = 'stage';
      _c.body.insertBefore(stage, _c.body.querySelector('.photo'));
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction');
        _c.body.append(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const u = _c.util;
      const actions = document.querySelector('.ref-foot') || u.el('footer', '', _c.body);
      actions.classList.add('footer-actions');
      _c.body.append(actions);
      const text = actions.querySelector('.ref-foot-text');
      if (text) text.remove();
      const reset = u.el('button', 'reset', null, 'Reset');
      reset.type = 'button';
      reset.dataset.action = 'reset';
      actions.prepend(reset);
      if (_c.placement !== 'footer' && _c.placement !== 'link' && _c.placement !== 'floating') {
        actions.classList.add('no-submit');
      }
      _c.actions = actions;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.querySelector('.ref-float-dock');
      if (dock) _c.actions.append(dock);
    },
  };

  env.site({
    name: 'design-set-slider-vertical-10',
    template: 'site/base',
    langs: ['en'],
    design: {
      THEMES: { paper },
      LOW_THEME: paper,
      ACCENTS: ['#4a62b8'],
      LOW_ACCENTS: ['#4a62b8'],
      parts,
    },
  });
})();
